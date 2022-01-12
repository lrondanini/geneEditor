

export default class Base {

	constructor(dna, id, baseName, isAntisenseStrand=false, position=0, color="#21252b", allFeatures=[]) {
		this.id = id;
		this.dna = dna;
		this.baseName = baseName;
		this.domElement = undefined;
		this.isAntisenseStrand = isAntisenseStrand;
		this.position = position;

		this.color = color;

		this.allFeatures = allFeatures; //by id

		this.InitDomNode();		
	}

	toJson() {
		return {
			id: this.id,
			baseName: this.baseName,
			isAntisenseStrand: this.isAntisenseStrand,
			position: this.position,
			color: this.color,
			allFeatures: this.allFeatures.slice()
		}
	}

	InitDomNode() {
		let de = document.createElement("div");
		de.style = "text-align:center;cursor:text;font-family: \"Lucida Console\", Monaco, monospace;font-size:14px;width:"+this.dna.cellWidth+"px;height:"+this.dna.cellHeight+"px;display:inline-block;color:"+this.color+";margin:0px;padding:0px;"
		de.setAttribute('ge-id', this.id);
		de.setAttribute('ge-type', "base");
		de.textContent = this.baseName;
		this.domElement = de
	}

	ChangeColor(newColor) {
		this.color = newColor;
		this.domElement.style.color = this.color;
	}

	ApplyColorToText(newColor) {
		this.domElement.style.color = newColor;
	}

	ApplyDefaultColorToText() {
		this.domElement.style.color = this.color;
	}

	GenerateAntisenseStrand() {
		let baseName = "";
		if(this.baseName.toUpperCase() == "T") {
			baseName = "A";
		} else if(this.baseName.toUpperCase() == "C") {
			baseName = "G";
		} else if(this.baseName.toUpperCase() == "A") {
			baseName = "T";
		} else if(this.baseName.toUpperCase() == "G") {
			baseName = "C";
		} else {
			baseName = this.baseName;
		}

		if(baseName!='') {
			let res = new Base(this.dna, this.dna.GenereateNewBaseId(), baseName, true);
			res.ChangeColor(this.color);
			this.dna.RegisterBase(res);
			return res;
		} else {
			return undefined;
		}
	}

	AddFeature(idFeature) {	
		if(this.allFeatures.indexOf(idFeature) < 0) {
			this.allFeatures.push(idFeature);	
		}
	}

	static CreateNew(dna, baseName) {
		let res = new Base(dna, dna.GenereateNewBaseId(), baseName);
		dna.RegisterBase(res);
		return res;
	}

	static FromJson(dna, json) {
		let res = new Base(dna, json.id, json.baseName, json.isAntisenseStrand, json.position, json.color, json.allFeatures);
		dna.RegisterBase(res);
		return res;
	}

}