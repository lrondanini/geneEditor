import EventsManager from './sequencial/EventsManager'
import FeaturesManager from "./common/FeaturesManager";

export default class SequencialView {
	constructor(container, dna) {
		this.viewerContainer = container;
		this.dna = dna;
		this.senseStrand = undefined;
		this.antisenseStrand = undefined;
		this.lines = [];
		
		this.featuresManager = new FeaturesManager(this.dna);
		this.eventsManager = new EventsManager(this);
	}


	ShowBasePosition(basePosition, x, y) {
		if(this.positionPnl == undefined) {
			this._initPositionPanel();
		}

		this.positionPnl.textContent = basePosition + 1;
		this.positionPnl.style.top = (y + 10) + "px";
		this.positionPnl.style.left = (x + 10) + "px";
		this.positionPnl.style.display = "block";
	}

	HideBasePosition() {
		if(this.positionPnl != undefined) {
			this.positionPnl.style.display = "none";
		}		
	}

	HighlightFeature(idFeature) {
		let feature = this.dna.GetFeatureById(idFeature);
		this.dna.senseStrand.slice(feature.start, feature.end+1).forEach((b) => {
			b.ApplyColorToText(feature.color);
		});
		this.dna.antiSenseStrand.slice(feature.start, feature.end+1).forEach((b) => {
			b.ApplyColorToText(feature.color);
		});
	}


	StopHighlightFeature(idFeature) {
		let feature = this.dna.GetFeatureById(idFeature);
		this.dna.senseStrand.slice(feature.start, feature.end+1).forEach((b) => {
			b.ApplyDefaultColorToText();
		});
		this.dna.antiSenseStrand.slice(feature.start, feature.end+1).forEach((b) => {
			b.ApplyDefaultColorToText();
		});
	}

	HighlightSegment(idFeature, idSegment) {
		let feature = this.dna.GetFeatureById(idFeature);
		feature.segments.forEach((seg) => {
			if(seg.id == idSegment) {
				this.dna.senseStrand.slice(seg.start, seg.end+1).forEach((b) => {
					b.ApplyColorToText(seg.color);
				});
				this.dna.antiSenseStrand.slice(seg.start, seg.end+1).forEach((b) => {
					b.ApplyColorToText(seg.color);
				});
			}
		});
	}

	StopHighlightSegment(idFeature, idSegment) {
		let feature = this.dna.GetFeatureById(idFeature);
		feature.segments.forEach((seg) => {
			if(seg.id == idSegment) {
				this.dna.senseStrand.slice(seg.start, seg.end+1).forEach((b) => {
					b.ApplyDefaultColorToText();
				});
				this.dna.antiSenseStrand.slice(seg.start, seg.end+1).forEach((b) => {
					b.ApplyDefaultColorToText();
				});
			}
		});
	}

	EditFeatureDetails(idFeature) {
		this.featuresManager.EditFeature(idFeature);
	}

	Draw() {
		//clean:
		this.HideBasePosition();
		let container = this.viewerContainer;		
		while(container.firstChild) {
		    container.removeChild(container.firstChild);
		}
		
		let basesPerLine = this.dna.basesPerLine;
		let senseStrand = this.dna.senseStrand;
		let antiSenseStrand = this.dna.antiSenseStrand;

		//26 = 5'/3' | 40 = _newLineNode margin |  30 + 60 = margin + right numbering label | 60 = nav bar on the side
		let lineWidth = basesPerLine*this.dna.cellWidth + 26 + 40 +  30 + 60 - 60; 
		container.style.minWidth = lineWidth+ "px";
		container.style.padding = "20px 0px 20px 0px";

		//container.parentNode.style.minWidth = lineWidth+ "px";	

		let currentLine = this._newLineNode();

		let senseLine = this._newBasesContainer("5'");		
		let antisenseLine = this._newBasesContainer("3'");

		let k = 0;
		let bpl = 0;
		let addToDoc = false;
		let start = 0;
		let featuresToPrint = [];
		senseStrand.forEach((b) => {
			b.position = k;
			let antiB = antiSenseStrand[k];
			antiB.position = k;
			senseLine.appendChild(b.domElement);
			antisenseLine.appendChild(antiB.domElement);

			addToDoc = true;

			k++;	
			bpl++;

			if(b.allFeatures.length > 0) {
				b.allFeatures.forEach(function(idFeature) {
					if(featuresToPrint.indexOf(idFeature) < 0) {
						featuresToPrint.push(idFeature);
					}
				});
			}

			if(bpl == basesPerLine) {
				container.appendChild(this._closeLine(currentLine, senseLine, antisenseLine, start, bpl, senseStrand.length, featuresToPrint));

				currentLine = this._newLineNode();
				senseLine = this._newBasesContainer();
				antisenseLine = this._newBasesContainer();
				featuresToPrint = [];

				addToDoc = false;
				start = start + bpl;
				bpl = 0;
			}					
		});

		if(addToDoc) {			
			container.appendChild(this._closeLine(currentLine, senseLine, antisenseLine, start, bpl, senseStrand.length, featuresToPrint));
		}

		this.eventsManager.HideCursor();	

		container.focus();		
	}

	_closeLine(currentLine, senseLine, antisenseLine, start, basesInLine, numberOfBases, featuresToPrint) {
		let meterLine = this._createMeterLine(start, basesInLine);

		let rightNumberingLabel = start + basesInLine;

		if(rightNumberingLabel == numberOfBases) {
			senseLine.appendChild(this._new53Container("3'", true));
			antisenseLine.appendChild(this._new53Container("5'", true));
		} else {
			senseLine.appendChild(this._new53Container(""));
			antisenseLine.appendChild(this._new53Container(""));
		}

		currentLine.appendChild(senseLine);
		currentLine.appendChild(meterLine);		
		currentLine.appendChild(antisenseLine);

		this._printFeatures(currentLine, start, basesInLine, featuresToPrint);

		return currentLine;
	}

	_newLineNode() {
		let line = document.createElement("div");
		line.style = "padding: 20px 0px 20px 40px;overflow:hidden;display:block;";
		return line;
	}

	_newBasesContainer(fiveThree="") {
		let line = document.createElement("div");
		line.style = "margin:0px;overflow:hidden;display:flex;";
		line.appendChild(this._new53Container(fiveThree));
		return line;
	}

	_new53Container(fiveThree="", alignRight = false) {
		let fiveThreeCell = document.createElement("div");
		if(!alignRight) {
			fiveThreeCell.style = "font-family: \"Lucida Console\", Monaco, monospace;font-size:12px;color:#8a8d94;width:26px;padding-top:2px;";	
		} else {
			fiveThreeCell.style = "font-family: \"Lucida Console\", Monaco, monospace;font-size:12px;color:#8a8d94;width:26px;padding-top:2px;text-align:right;";
		}
		
		fiveThreeCell.textContent = fiveThree;
		return fiveThreeCell;
	}

	_createMeterLine(start, end) {
		let meterLine = document.createElement("div");
		meterLine.style = "overflow:hidden;margin:3px 0px 3px 26px;display:flex;";
		let canvas = document.createElement("canvas");

		canvas.height = this.dna.cellHeight;
		let cWidth = end * this.dna.cellWidth;
		canvas.width = cWidth;
			

		let midHeight = this.dna.cellHeight/2 - 0.5;
		let ctx = canvas.getContext('2d');
		ctx.beginPath();
		ctx.strokeStyle = "#ababab";
		ctx.lineWidth = 1;
		ctx.lineCap = 'round';
		ctx.moveTo(0 , midHeight);
		ctx.lineTo(cWidth , midHeight);
		

		//vertical
		let left = this.dna.cellWidth / 2;
		left = left - 0.5;
		let k = 0;
		let counter10 = 1; //9 
		while(k < end) {
			let length = 2;
			if(counter10 == 5) {
				length = 4; //5th position
			} else if(counter10 == 10) {
				counter10 = 0;
				length = 6; //10th position
			} 

			ctx.moveTo(left , midHeight - length);
			ctx.lineTo(left , midHeight + length);
			

			left = left + this.dna.cellWidth;
			k++;
			counter10++;
		}
		
		ctx.stroke();

		meterLine.appendChild(canvas);

		let numberingLabel = document.createElement("span");
		numberingLabel.style = "margin: 0px 0px 0px 30px; width:60px;font-size:12px;color:#8a8d94;vertical-align:top;display:block;";
		numberingLabel.textContent = start + end;

		meterLine.appendChild(numberingLabel);

		return meterLine;
	}

	_printFeatures(currentLine, start, basesInLine, featuresToPrint) {
		if(featuresToPrint.length > 0) {
			featuresToPrint.forEach((idFeature) => {
				let feature = this.dna.GetFeatureById(idFeature);

				let featureLength = feature.end - feature.start + 1;

				let featureLine = document.createElement("div");
				featureLine.style = "overflow:hidden;margin:10px 0px 3px 26px;display:flex;";
					
				let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
				let lineHeight = this.dna.cellHeight + 2;
				let lineWidth = basesInLine * this.dna.cellWidth;

				svg.setAttributeNS(null, 'width', lineWidth);
				svg.setAttributeNS(null, 'height', lineHeight);

				let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
				group.style = "cursor: pointer";
				group.addEventListener("mouseover", (e) => { this.HighlightFeature(feature.id) });
				group.addEventListener("mouseout", (e) => { this.StopHighlightFeature(feature.id) });
				group.addEventListener("click", (e) => { this.EditFeatureDetails(feature.id) });

				let startingPoint = (feature.start - start) * this.dna.cellWidth;
				let widthFeature = (feature.end - feature.start + 1) * this.dna.cellWidth;
				
				if(startingPoint<0) {
					widthFeature = widthFeature + startingPoint;
					startingPoint = 0;
				}

				if(feature.end > start + basesInLine) {
					widthFeature = (basesInLine * this.dna.cellWidth) - startingPoint;
				}
			
				if(feature.start < start) {
					let triStart = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
					let points = startingPoint+" 0";
					let stepHeight = lineHeight/6;
					points = points + ", "+(startingPoint+this.dna.cellWidth/2)+" "+stepHeight;
					points = points + ", "+startingPoint+" "+(2*stepHeight);
					points = points + ", "+(startingPoint+this.dna.cellWidth/2)+" "+(3*stepHeight);
					points = points + ", "+startingPoint+" "+(4*stepHeight);
					points = points + ", "+(startingPoint+this.dna.cellWidth/2)+" "+(5*stepHeight);
					points = points + ", "+startingPoint+" "+lineHeight;
					points = points+", "+(startingPoint+this.dna.cellWidth)+" "+lineHeight;	
					points = points+", "+(startingPoint+this.dna.cellWidth)+" 0";					
					triStart.setAttributeNS(null,"points", points);
					triStart.setAttributeNS(null, 'fill', feature.color);
					group.appendChild(triStart);
				} else {
					//nondirectional | forward | reverse | bidirectional
					if(feature.direction == "nondirectional" || feature.direction == "forward") {
						let rectStart = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
						rectStart.setAttributeNS(null,"x", startingPoint);
						rectStart.setAttributeNS(null,"y", 0);
						rectStart.setAttributeNS(null,"width", this.dna.cellWidth);
						rectStart.setAttributeNS(null,"height", lineHeight);
						rectStart.setAttributeNS(null, 'fill', feature.color);
						group.appendChild(rectStart);
					} else if(feature.direction == "reverse" || feature.direction == "bidirectional") {
						let triStart = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
						let points = startingPoint+" "+lineHeight/2;
						points = points+", "+(startingPoint+this.dna.cellWidth)+" 0";
						points = points+", "+(startingPoint+this.dna.cellWidth)+" "+lineHeight;					
						triStart.setAttributeNS(null,"points", points);
						triStart.setAttributeNS(null, 'fill', feature.color);
						group.appendChild(triStart);
					}
				}

				startingPoint = startingPoint + this.dna.cellWidth;
				widthFeature = widthFeature - (2 * this.dna.cellWidth); // 2 = space for the closing rectangle
				
				if(featureLength>1) {
					if(featureLength>2) {
						let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
						rect.setAttributeNS(null,"x", startingPoint);
						rect.setAttributeNS(null,"y", 0);
						rect.setAttributeNS(null,"width", widthFeature);
						rect.setAttributeNS(null,"height", lineHeight);
						rect.setAttributeNS(null, 'fill', feature.color);

						group.appendChild(rect);

						let textColor = this._getTextColor(feature.color);
						let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
						text.style = "font-size:12px;font-family:arial;"
						text.textContent = feature.name;
						text.setAttributeNS(null,"x", startingPoint);
						text.setAttributeNS(null,"y", this.dna.cellHeight - 2);
						text.setAttributeNS(null,"fill", textColor);

						group.appendChild(text);
					}

					//close:
					let startPoint = startingPoint + widthFeature;
					if(feature.end > start + basesInLine) {
						//more rect
						let triEnd = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
						let points = startPoint+" 0";
						let stepHeight = lineHeight/6;
						points = points + ", "+(startPoint + this.dna.cellWidth)+" 0";
						points = points + ", "+(startPoint + this.dna.cellWidth/2)+" "+(stepHeight);
						points = points + ", "+(startPoint + this.dna.cellWidth)+" "+(2*stepHeight);
						points = points + ", "+(startPoint + this.dna.cellWidth/2)+" "+(3*stepHeight);
						points = points + ", "+(startPoint + this.dna.cellWidth)+" "+(4*stepHeight);
						points = points + ", "+(startPoint + this.dna.cellWidth/2)+" "+(5*stepHeight);
						points = points + ", "+(startPoint + this.dna.cellWidth)+" "+(lineHeight);
						points = points+", "+(startPoint)+" "+lineHeight;					
						triEnd.setAttributeNS(null,"points", points);
						triEnd.setAttributeNS(null, 'fill', feature.color);
						group.appendChild(triEnd);


					} else {
						if(feature.direction == "nondirectional" || feature.direction == "reverse") {
							let rectEnd = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
							rectEnd.setAttributeNS(null,"x", startPoint);
							rectEnd.setAttributeNS(null,"y", 0);
							rectEnd.setAttributeNS(null,"width", this.dna.cellWidth);
							rectEnd.setAttributeNS(null,"height", lineHeight);
							rectEnd.setAttributeNS(null, 'fill', feature.color);
							group.appendChild(rectEnd);
						} else if(feature.direction == "forward" || feature.direction == "bidirectional") {
							let triEnd = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
							let points = startPoint+" 0";
							points = points+", "+(startPoint+this.dna.cellWidth)+" "+lineHeight/2;
							points = points+", "+startPoint+" "+lineHeight;					
							triEnd.setAttributeNS(null,"points", points);
							triEnd.setAttributeNS(null, 'fill', feature.color);
							group.appendChild(triEnd);
						}
					}
					
				}
				
				svg.appendChild(group);	

				//-----------SEGMENTS:
				feature.segments.forEach((seg) => {
					let segStart = (seg.start-start) * this.dna.cellWidth;
					let widthFeature = (seg.end - seg.start + 1) * this.dna.cellWidth;

					let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
					group.style = "cursor: pointer";
					group.addEventListener("mouseover", (e) => { this.HighlightSegment(feature.id, seg.id) });
					group.addEventListener("mouseout", (e) => { this.StopHighlightSegment(feature.id, seg.id) });
					group.addEventListener("click", (e) => { this.EditFeatureDetails(feature.id) });

					let rectSeg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
					rectSeg.setAttributeNS(null,"x", segStart);
					rectSeg.setAttributeNS(null,"y", 0);
					rectSeg.setAttributeNS(null,"width", widthFeature);
					rectSeg.setAttributeNS(null,"height", lineHeight);
					rectSeg.setAttributeNS(null, 'fill', seg.color);
					if(seg.color == feature.color) {
						rectSeg.setAttributeNS(null, 'stroke', "#ffffff");
					}
					
					group.appendChild(rectSeg);

					let textColor = this._getTextColor(seg.color);
					let text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
					text.style = "font-size:12px;font-family:arial;"
					text.textContent = seg.name;
					text.setAttributeNS(null,"x", segStart);
					text.setAttributeNS(null,"y", this.dna.cellHeight - 2);
					text.setAttributeNS(null,"fill", textColor);

					group.appendChild(text);

					svg.appendChild(group);
				});
				
				featureLine.appendChild(svg);

				currentLine.appendChild(featureLine);
			});
		}
	}

	_getTextColor(hexcolor){
		hexcolor = hexcolor.replace("#","");
	    return (parseInt(hexcolor, 16) > 0xffffff/2) ? '#21252b':'#ffffff';
	}

	/***** END DRAWING FUNCTIONS *****/

	_initPositionPanel() {
		let pp = document.createElement("div");
		pp.style = "display:none;position: absolute;padding:2px;border:1px solid #1b2930; border-radius:4px; background-color:#37434a; color:#ffffff;font-size:12px; font-family:arial;";
		this.positionPnl = pp;
		document.body.appendChild(this.positionPnl);
	}



}