import IdManager from '../utils/IdManager';
import InterfaceManager from '../ui/InterfaceManager';
import Base from './Base';
import Feature from './Feature';
import Segment from './Segment';
import HistoryManager from '../utils/HistoryManager';

export default class DNA {
	constructor(nodeContainer, sequence, basesPerLine, onChange) {
		this.parentNode = nodeContainer;
		
		this.sequence = sequence; //json representation 

		this.senseStrand = [];
		this.antiSenseStrand = [];
		this.selectedBases = [];

		this.basesPerLine = basesPerLine;

		if(this.basesPerLine == undefined) {
			this.basesPerLine = 110;
		}

		this.allBasesById = {};
		this.allFeaturesById = {}; 

		this.idManager = new IdManager();
		this.interfaceManager = new InterfaceManager(this);

		//height and width of each base cell - WARNING: use even numbers!
		this.cellHeight = 14;
		this.cellWidth = 10;

		this.historyManager = new HistoryManager();

		this.onChange = onChange;

		this._init();
	}

	_init() {
		if(this.sequence == undefined || this.sequence == "") {
			this._initEmptyDna();
		}
	}

	_initEmptyDna() {
		this.AddBaseFromChar("?", true, 0);
	}

	CleanEverything() {
		this.senseStrand = [];
		this.antiSenseStrand = [];
		this.selectedBases = [];
		this.allBasesById = {};
		this.allFeaturesById = {}; 
	}

	Draw() {
		this.interfaceManager.Draw();	
	}

	GenereateNewBaseId() {
		return this.idManager.GetNew();
	}

	RegisterBase(base) {
		this.allBasesById[base.id] = base;			
	}

	RegisterFeature(feature) {
		this.allFeaturesById[feature.id] = feature;			
	}

	RemoveFeature(feature) {
		delete this.allFeaturesById[feature.id];			
	}

	GetBaseById(id) {
		return this.allBasesById[id];
	}

	GetFeatureById(id) {
		return this.allFeaturesById[id];
	}

	GetBaseFromAntiBase(antiBase) {
		return this.senseStrand[antiBase.position];
	}

	GetAntiBaseFromBase(base) {
		return this.antiSenseStrand[base.position];
	}

	toJson() {
		let status = {};

		status.senseStrand = [];
		this.senseStrand.forEach((b) => {
			status.senseStrand.push(b.toJson());
		});

		status.features = [];
		Object.keys(this.allFeaturesById).forEach((idFeature) => {
			status.features.push(this.allFeaturesById[idFeature].toJson());
		});

		return status;
	}

	LoadFromJson(json) {
		this.CleanEverything();

		json.senseStrand.forEach((b) => {
			let base = Base.FromJson(this, b);
			this.senseStrand.push(base);
			this.antiSenseStrand.push(base.GenerateAntisenseStrand());
		});

		if(json.features!=undefined) {
			json.features.forEach((f) => {
				Feature.FromJson(this, f); //it also register the feature
			});
		}

		this.interfaceManager.Draw(); 
	}

	CopyToClipBoard() {
		let str = "";
		this.selectedBases.forEach((b) => {
			str = str+b.baseName;
		});

		var dummy = document.createElement("textarea");
	    document.body.appendChild(dummy);
	    dummy.value = str;
	    dummy.select();
	    document.execCommand("copy");
	    document.body.removeChild(dummy);
	}


	PushToHistory() {
		let status = this.toJson();
		this.historyManager.Push(status);
		if(this.onChange!=undefined) {
			this.onChange(status);
		}
	}

	Undo() {
		let p = this.historyManager.Undo();
		this.LoadFromJson(p);
		if(this.onChange!=undefined) {
			this.onChange(p);
		}
	}

	Redo() {
		let p = this.historyManager.Redo();
		this.LoadFromJson(p);
		if(this.onChange!=undefined) {
			this.onChange(p);
		}
	}

	AddBasesAtCursor(str, position) {
		for(let i =0; i < str.length; i++) {
			this.AddBaseFromChar(str[i].toUpperCase(), false, position + i, true);
		};
		this.interfaceManager.Draw();
		this.PushToHistory();	

	}

	AddBaseFromChar(char, draw=true, position=0, doNotPushToHistory=false) {
		let base = Base.CreateNew(this, char);
		if(position == 0) {
			this.senseStrand.unshift(base); 
			this.antiSenseStrand.unshift(base.GenerateAntisenseStrand());
		} else {
			let justPush = false;
			if(position >= this.senseStrand.length) {
				position = this.senseStrand.length - 1;
				justPush = true;
			} 
			let prevBase = this.senseStrand[position];
			base.ChangeColor(prevBase.color);
			base.allFeatures = prevBase.allFeatures.slice();
			base.allFeatures.forEach((idFeature) => {
				this.GetFeatureById(idFeature).end++;
			});
			if(justPush) {
				this.senseStrand.push(base);			
				this.antiSenseStrand.push(base.GenerateAntisenseStrand());
			} else {
				this.senseStrand.splice(position, 0, base);			
				this.antiSenseStrand.splice(position, 0, base.GenerateAntisenseStrand());
			}			
		}
		
		if(draw) {
			this.interfaceManager.Draw();	
		}

		if(!doNotPushToHistory) {
			this.PushToHistory();	
		}
		

		return base;
	}

	DeleteBase(position, draw=true) {
		let baseToDelete = this.senseStrand[position];
		baseToDelete.allFeatures.forEach((idFeature) => {
			let feature = this.GetFeatureById(idFeature);
			feature.RemoveBase(baseToDelete);
		});
		this.senseStrand.splice(position, 1);
		this.antiSenseStrand.splice(position, 1);

		if(this.senseStrand.length == 0) {
			this._initEmptyDna();	
		}

		if(draw) {
			this.interfaceManager.Draw();	
		}

		this.PushToHistory();
		
	}

	DeleteSelectedBases() {
		let position = undefined; //res

		let f = true;
		let numbOfBases = 0;
		this.selectedBases.forEach((b) => {
			if(f) {
				position = b.position;
				f=false;
			}
			b.allFeatures.forEach((idFeature) => {
				let feature = this.GetFeatureById(idFeature);
				feature.RemoveBase(b);
			});
			numbOfBases++;			
		});

		this.senseStrand.splice(position, numbOfBases);
		this.antiSenseStrand.splice(position, numbOfBases);

		if(this.senseStrand.length == 0) {
			this._initEmptyDna();	
		}

		this.interfaceManager.Draw();

		this.PushToHistory();	

		return position;
	}

	LoadFromString(str) {
		this.CleanEverything();
		for(let i =0; i<str.length; i++) {
			this.AddBaseFromChar(str[i].toUpperCase(), false, i, true);
		};
		this.interfaceManager.Draw();
		this.PushToHistory();	
	}

	ChangeSelectedBasesColor(newColor) {
		this.selectedBases.forEach((b) => {
			b.ChangeColor(newColor);
			this.GetAntiBaseFromBase(b).ChangeColor(newColor);
			this.PushToHistory();
		});
	}

	AddNewFeature(name, direction, color) {
		if(this.selectedBases.length > 0) {
			let newFeature = Feature.CreateNew(this, name, direction, this.selectedBases, color);
			this.interfaceManager.Draw();
			this.PushToHistory();
		}
	}

	AddSegment(idFeature) {
		if(this.selectedBases.length > 0) {
			let f = this.GetFeatureById(idFeature);
			Segment.CreateNew(this, name, idFeature, this.selectedBases, f.color);
			this.PushToHistory();
		}
	}


}