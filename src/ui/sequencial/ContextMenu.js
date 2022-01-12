import ColorPicker from "../utils/ColorPicker";
import FeaturesManager from "../common/FeaturesManager";

export default class ContextMenu {
	constructor(dna, featuresManager) {
		this.dna = dna;

		this.top = "0px";
		this.left = "0px";

		this.featuresManager = featuresManager;

	}

	Hide() {
		if(this.pnl != undefined) {
			this.pnl.style.display = "none";
		}
	}

	Show(mouseEvent) {
		if(this.pnl == undefined) {
			this.InitPanel();
		}


		this.btnSegment.style.display = "none";

		let selectionInsideFeature = true;
		
		this.featureForSegments = [];

		if(this.dna.selectedBases.length == 0) {
			selectionInsideFeature = false;
		} else {
			let featureForSegments = [];
			let f = true;
			this.dna.selectedBases.forEach((b) => {
				if(selectionInsideFeature) {
					if(b.allFeatures.length == 0) {
						selectionInsideFeature = false;
					} else {
						if(f) {
							featureForSegments = b.allFeatures;
							f = false;
						} else {
							//find features that belogns to both
							let tmp = [];
							b.allFeatures.forEach((idFeature) => {
								if(featureForSegments.indexOf(idFeature) > -1) {
									tmp.push(idFeature);
								}
							});
							featureForSegments = tmp;
						}
					}
				}				
			});

			if(featureForSegments.length == 0) {
				selectionInsideFeature = false;
			}

			if(selectionInsideFeature) {
				this.featureForSegments = featureForSegments;
			}			
		}

		if(selectionInsideFeature) {
			this.btnSegment.style.display = "block";
		}	

		this.top = (mouseEvent.pageY + window.scrollY + 2) 
		this.left = (mouseEvent.pageX + window.scrollX + 2) 

		this.pnl.style.top = this.top + "px";
		this.pnl.style.left = this.left + "px";

		this.pnl.style.display = "block";
	}

	Destroy() {
		if(this.pnl != undefined) {
			this.pnl.parentNode.removeChild(this.pnl);
		}
		this.featuresManager.Destroy();
	}

	InitPanel() {
		let pnl = document.createElement("div");
		pnl.style = "background-color:#ffffff;position:absolute;display:none;z-index:999999;box-shadow:5px 5px 5px #e3e3e3;border-radius:4px;border:1px solid #e3e3e3;";

		let itemStyle = "padding:10px; font-size:14px; font-family:arial;cursor:pointer;color:#21252B;";
		let btnColor = document.createElement("div");
		btnColor.style = itemStyle;
		btnColor.textContent = "Set Color...";
		btnColor.addEventListener("mouseover", (e) => {
			btnColor.style.color = "#30b7e8";
		});
		btnColor.addEventListener("mouseout", (e) => {
			btnColor.style.color = "#21252B";
		});
		btnColor.addEventListener("click", (e) => {
			this.Hide();
			new ColorPicker(this.top, this.left, (c) => this.ChangeBasesColor(c));
		});
		pnl.appendChild(btnColor);

		let btnFeature = document.createElement("div");
		btnFeature.style = itemStyle;
		btnFeature.textContent = "Add Feature";
		btnFeature.addEventListener("mouseover", (e) => {
			btnFeature.style.color = "#30b7e8";
		});
		btnFeature.addEventListener("mouseout", (e) => {
			btnFeature.style.color = "#21252B";
		});
		btnFeature.addEventListener("click", (e) => {
			this.Hide();
			this.featuresManager.AddNew();
		});
		pnl.appendChild(btnFeature);


		let btnSegment = document.createElement("div");
		btnSegment.style = itemStyle;
		btnSegment.textContent = "Add Segment";
		btnSegment.addEventListener("mouseover", (e) => {
			btnSegment.style.color = "#30b7e8";
		});
		btnSegment.addEventListener("mouseout", (e) => {
			btnSegment.style.color = "#21252B";
		});
		btnSegment.addEventListener("click", (e) => {
			this.Hide();
			this.featuresManager.AddSegment(this.featureForSegments[0]);
		});
		this.btnSegment = btnSegment;
		pnl.appendChild(btnSegment);

		document.body.appendChild(pnl);
		this.pnl = pnl;
	}

	ChangeBasesColor(c) {
		this.dna.ChangeSelectedBasesColor(c);
	}


}