
export default class MapView {
	constructor(container, dna) {
		this.dna = dna;
		this.viewerContainer = container;
		
		//use even number
		this.width = 800;
		this.height = 600;
	}


	Draw() {
		//clean:
		let container = this.viewerContainer;
		while(container.firstChild) {
		    container.removeChild(container.firstChild);
		}

		let senseStrand = this.dna.senseStrand;
		let antiSenseStrand = this.dna.antiSenseStrand;

		container.style.width = this.width+"px";
		container.style.height = this.height+"px";
		container.parentNode.style.width = this.width+"px";

		let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.style.width = this.width+"px";
		svg.style.height = this.height+"px";
		svg.setAttributeNS(null, 'width', this.width);
		svg.setAttributeNS(null, 'height',  this.height);

		let centerX = this.width/2;
		let centerY = this.height/2;

		
		let dnaCircleSense = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		dnaCircleSense.setAttribute("stroke", "#323940");
	    dnaCircleSense.setAttribute("stroke-width", 2);
	    dnaCircleSense.setAttribute("fill", "transparent");

	    dnaCircleSense.setAttributeNS(null,"cx", centerX);
    	dnaCircleSense.setAttributeNS(null,"cy", centerY);
    	dnaCircleSense.setAttributeNS(null,"r", 140);

    	svg.appendChild(dnaCircleSense);

    	let dnaCircleAntiSense = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		dnaCircleAntiSense.setAttribute("stroke", "#323940");
	    dnaCircleAntiSense.setAttribute("stroke-width", 2);
	    dnaCircleAntiSense.setAttribute("fill", "transparent");

	    dnaCircleAntiSense.setAttributeNS(null,"cx", centerX);
    	dnaCircleAntiSense.setAttributeNS(null,"cy", centerY);
    	dnaCircleAntiSense.setAttributeNS(null,"r", 136);

    	svg.appendChild(dnaCircleAntiSense);


    	let zero = document.createElementNS("http://www.w3.org/2000/svg", "line");
		zero.setAttribute("stroke", "#323940");
	    zero.setAttribute("stroke-width", 3);

	    zero.setAttributeNS(null,"x1", centerX);
    	zero.setAttributeNS(null,"y1", centerY - 136);
    	zero.setAttributeNS(null,"x2", centerX);
    	zero.setAttributeNS(null,"y2", centerY - 120);

    	svg.appendChild(zero);


    	container.appendChild(svg);
	}


}