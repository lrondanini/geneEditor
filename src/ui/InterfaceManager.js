import SequencialView from './Sequencial';
import MapView from './Map';
import MenuBar from "./MenuBar";

export default class InterfaceManager {
	constructor(dna) {
		this.dna = dna;
		this.menuBar = new MenuBar(this.dna);
		this.menuBar.Draw();

		this.viewerContainer = document.createElement("div");
		this.dna.parentNode.appendChild(this.viewerContainer);

		this.viewType = "sequencial"; //map"; //
		this.sequencialView = new SequencialView(this.viewerContainer, this.dna);
		this.mapView = new MapView(this.viewerContainer, this.dna);
		
	}

	//draw only the content! bar is draw on new!
	Draw() {		
		if(this.viewType == "sequencial") {
			this.sequencialView.Draw();
		} else if(this.viewType == "map") {
			this.mapView.Draw();
		}
	}
	
}