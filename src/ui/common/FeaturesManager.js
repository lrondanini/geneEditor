import ColorPicker from '../utils/ColorPicker';

export default class FeaturesManager {
	constructor(dna) {
		this.dna = dna;
	}

	Destroy() {
		if(this.pnl != undefined) {
			this.pnl.parentNode.removeChild(this.pnl);
		}
	}

	AddSegment(idFeature) {
		if(idFeature!=undefined) {
			this.dna.AddSegment(idFeature);
			this.editingFeature = this.dna.GetFeatureById(idFeature);			
			this.Show();
		}
	}

	EditFeature(idFeature) {
		if(idFeature!=undefined) {
			this.editingFeature = this.dna.GetFeatureById(idFeature);
			this.Show();
		}
	}

	AddNew() {
		this.editingFeature = {
			id: undefined,
			name: '',
			direction: 'nondirectional',
			color: '#ccd9db'
		}

		this.Show();
	}

	Show() {
		if(this.pnl == undefined) {
			this.InitPanel();
		}
		this._reset();

		this.pnl.style.display = "flex";
	}

	Hide() {
		this.pnl.style.display = "none";
	}

	InitPanel() {
		let _self = this;
		let pnl = document.createElement("div");
		pnl.style = "justify-content:center;align-items:center;width:100vw;height:100vh;background-color:rgba(33, 37, 43, 0.5);position:absolute;display:none;z-index:9999;top:0px;left:0px;";

		let pnlEditing = document.createElement("div");
		pnlEditing.style = "background-color:#ffffff;padding:10px 20px 20px 20px;border-radius:6px;width:300px;height:300;font-family:arial; color: #21252B;"

		//-----CLOSE/CANCEL
		let btnCancelPnl = document.createElement("div"); // Nondirectional, Forward, Reverse, Bidirectional
		btnCancelPnl.style = "display: flex; font-size:14px;align-items:center;margin-bottom: 10px;";

		let spacerCancel = document.createElement("div");
		spacerCancel.style = "flex:1";
		btnCancelPnl.appendChild(spacerCancel);

		let btnCancel = document.createElement("div");
		btnCancel.style = "padding:0px;cursor:pointer;color:#21252B;width:10px;";
		btnCancel.textContent = "X";
		btnCancel.addEventListener("mouseover", function() {
			this.style.color = "#FF9100";
		});
		btnCancel.addEventListener("mouseout", function() {
			this.style.color = "#21252B";
		});
		btnCancel.addEventListener("click",() => this.Hide());
		btnCancelPnl.appendChild(btnCancel);

		pnlEditing.appendChild(btnCancelPnl);
		


		//------NAME
		let namePnl = document.createElement("div");
		namePnl.style = "display: flex; font-size:14px;align-items:center;";

		let nameLbl = document.createElement("div");
		nameLbl.style = "margin-right:6px;"
		nameLbl.textContent = "Feature:";
		namePnl.appendChild(nameLbl);

		let nameInput = document.createElement("input");
		nameInput.style = "width:230px;font-size:14px;padding:4px;border-radius:4px;border:1px solid #e3e3e3;";
		nameInput.addEventListener("change", function() {
			_self.editingFeature.name = this.value;
		});	
		this.nameInput = nameInput;
		namePnl.appendChild(nameInput);

		pnlEditing.appendChild(namePnl);

		//---- DIRECTION
		let directionPnl = document.createElement("div"); // Nondirectional, Forward, Reverse, Bidirectional
		directionPnl.style = "display: flex; font-size:14px;align-items:center;margin-top:20px;";

		let nondirectionalLbl = document.createElement("div");
		nondirectionalLbl.style = "margin-right:8px;color: #30b7e8;cursor:pointer;";
		nondirectionalLbl.textContent = "Nondirectional";
		nondirectionalLbl.addEventListener("click", () => {
			this.ChangeDirection("nondirectional");
		});
		this.nondirectionalLbl = nondirectionalLbl;
		directionPnl.appendChild(nondirectionalLbl);

		let forwardLbl = document.createElement("div");
		forwardLbl.style = "margin-right:8px;cursor:pointer;";
		forwardLbl.textContent = "Forward";
		forwardLbl.addEventListener("click", () => {
			this.ChangeDirection("forward");
		});
		this.forwardLbl = forwardLbl;
		directionPnl.appendChild(forwardLbl);

		let reverseLbl = document.createElement("div");
		reverseLbl.style = "margin-right:8px;cursor:pointer;";
		reverseLbl.textContent = "Reverse";
		reverseLbl.addEventListener("click", () => {
			this.ChangeDirection("reverse");
		});
		this.reverseLbl = reverseLbl;
		directionPnl.appendChild(reverseLbl);

		let bidirectionalLbl = document.createElement("div");
		bidirectionalLbl.style = "margin-right:8px;cursor:pointer;";
		bidirectionalLbl.textContent = "Bidirectional";
		bidirectionalLbl.addEventListener("click", () => {
			this.ChangeDirection("bidirectional");
		});
		this.bidirectionalLbl = bidirectionalLbl;
		directionPnl.appendChild(bidirectionalLbl);

		pnlEditing.appendChild(directionPnl);

		//---- COLOR
		let colorPnl = document.createElement("div");
		colorPnl.style = "display: flex; font-size:14px;align-items:center;margin-top:20px;";

		let colorLbl = document.createElement("div");
		colorLbl.style = "margin-right:6px;"
		colorLbl.textContent = "Color:";
		colorPnl.appendChild(colorLbl);

		let colorInput = document.createElement("div");
		colorInput.style = "width:18px;height:18px;border-radius:4px;background-color:#ccd9db;cursor:pointer;";
		colorInput.addEventListener("click", function(e) {
			let rect = this.getBoundingClientRect();
			new ColorPicker(rect.top, rect.left,(c) => _self.ChangeColor(c))
		});	
		this.colorInput = colorInput;
		colorPnl.appendChild(colorInput);

		pnlEditing.appendChild(colorPnl);


		//------ SEGMENTS
		let segmentsTitle = document.createElement("div");
		segmentsTitle.style = "margin-top:20px;font-size:14px;";
		segmentsTitle.textContent = "Segments:";
		this.segmentsTitle = segmentsTitle;
		pnlEditing.appendChild(segmentsTitle);

		let segmentsPnl = document.createElement("div");
		segmentsPnl.style = "padding:6px;border:1px solid #e3e3e3; border-radius:4px;margin-top:4px;";
		this.segmentsPnl = segmentsPnl;
		pnlEditing.appendChild(segmentsPnl);

		//---- SAVE
		let btnPnl = document.createElement("div"); // Nondirectional, Forward, Reverse, Bidirectional
		btnPnl.style = "display: flex; font-size:14px;align-items:center;margin-top:20px;";

		let spacer = document.createElement("div");
		spacer.style = "flex:1";
		btnPnl.appendChild(spacer);

		let btnSave = document.createElement("div");
		btnSave.style = "padding:6px;cursor:pointer;background-color:#30b7e8;color:#ffffff;border-radius:4px;";
		btnSave.textContent = "Save";
		btnSave.addEventListener("mouseover", function() {
			this.style.backgroundColor = "#FF9100";
		});
		btnSave.addEventListener("mouseout", function() {
			this.style.backgroundColor = "#30b7e8";
		});
		btnSave.addEventListener("click",() => this.Save());
		btnPnl.appendChild(btnSave);

		pnlEditing.appendChild(btnPnl);
		
		pnl.appendChild(pnlEditing);

		document.body.appendChild(pnl);
		this.pnl = pnl;
	}

	_generateSegmentsPnl() {
		while(this.segmentsPnl.firstChild) {
		    this.segmentsPnl.firstChild.remove();
		}

		let hideSegments = true;
		if(this.editingFeature.segments == undefined) {
			this.editingFeature.segments = [];
		}
		this.editingFeature.segments.forEach((seg) => {
			hideSegments = false;
			let segment = document.createElement("div");
			segment.style = "display:flex";

			let nameInput = document.createElement("input");
			nameInput.style = "width:140px;font-size:14px;padding:4px;border-radius:4px;border:1px solid #e3e3e3;";
			nameInput.addEventListener("change", function() {
				seg.name = this.value;
			});	
			nameInput.value = seg.name;
			segment.appendChild(nameInput);

			let baseSpan = document.createElement("div");
			baseSpan.style = "font-size:14px;margin:5px 0px 0px 20px;";
			baseSpan.textContent = (seg.start+1) + "..." + (seg.end+1);
			segment.appendChild(baseSpan);

			let colorInput = document.createElement("div");
			colorInput.style = "width:18px;height:18px;border-radius:4px;background-color:"+seg.color+";cursor:pointer;margin:4px 0px 0px 20px;";
			colorInput.addEventListener("click", function(e) {
				let rect = this.getBoundingClientRect();
				new ColorPicker(rect.top, rect.left,(c) => {
					seg.color = c;
					colorInput.style.backgroundColor = c;
				});
			});	
			segment.appendChild(colorInput);

			this.segmentsPnl.appendChild(segment)
		});

		if(hideSegments) {
			this.segmentsPnl.style.display = "none";
			this.segmentsTitle.style.display = "none";
		}
	}

	ChangeDirection(d) {
		this.editingFeature.direction = d;

		this.nondirectionalLbl.style.color = "#21252B";
		this.forwardLbl.style.color = "#21252B";
		this.reverseLbl.style.color = "#21252B";
		this.bidirectionalLbl.style.color = "#21252B";

		if(d == "nondirectional") {
			this.nondirectionalLbl.style.color = "#30b7e8";
		} else if(d == "forward") {
			this.forwardLbl.style.color = "#30b7e8";
		} else if(d == "reverse") {
			this.reverseLbl.style.color = "#30b7e8";
		} else if(d == "bidirectional") {
			this.bidirectionalLbl.style.color = "#30b7e8";
		}  
	}

	ChangeColor(c) {
		this.editingFeature.color = c;
		this.colorInput.style.backgroundColor = c;
	}

	_reset() {
		this.nameInput.value = this.editingFeature.name;
		this.colorInput.style.backgroundColor = this.editingFeature.color;
		this.ChangeDirection(this.editingFeature.direction);
		if(this.editingFeature.id == undefined) {
			this.segmentsPnl.style.display = "none";
			this.segmentsTitle.style.display = "none";
		} else {
			this.segmentsPnl.style.display = "block";
			this.segmentsTitle.style.display = "block";
		}

		this._generateSegmentsPnl();
	}

	Save() {
		this.Hide();
		if(this.editingFeature.id == undefined) {
			this.dna.AddNewFeature(this.editingFeature.name, this.editingFeature.direction, this.editingFeature.color);
		} else {
			this.dna.Draw();
		}
		
	}
}