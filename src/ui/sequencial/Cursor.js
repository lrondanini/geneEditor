export default class Cursor {
	constructor(dna) {
		this.dna = dna;
		this.blinkingInterval = undefined;

		this.startBase = undefined;
		this.startBaseLine = 0;

		this.endBase = undefined;
		this.endBaseLine = 0;

		this.cursor = undefined;
		this.dna.selectedBases = [];
		this.Init();
	}

	Init() {
		let cursor = document.createElement("div");
		cursor.style = "width:2px;height:48px;background-color:#30b7e8;position:absolute;display:none;";
		document.body.appendChild(cursor);
		this.cursor = cursor;
	}


	Destroy() {
		this.cursor.parentNode.removeChild(this.cursor);
	}

	Show(position) {
		if(position!=undefined) {
			this.startBase = this.dna.senseStrand[position];
			let basesPerLine = this.dna.basesPerLine;
			if(this.startBase!=undefined) {
				this.startBaseLine = parseInt(this.startBase.position / basesPerLine);
			} else {
				this.startBaseLine = 0;
			}
		} 

		this.SetCursorPosition();	
		this.Blink();		
		
	}

	ShowOnTop() {
		this.startBase = undefined;
		let rectSense = this.dna.senseStrand[0].domElement.getBoundingClientRect();
		this.cursor.style.top = (rectSense.top + window.scrollY - 2) + "px";
		this.cursor.style.left = (rectSense.left) + "px";
		this.cursorIsOnTop = true;
	}

	SetCursorPosition() {
		if(this.startBase!=undefined) {
			let rectSense = this.startBase.domElement.getBoundingClientRect();
			this.cursor.style.top = (rectSense.top + window.scrollY + 1) + "px";
			this.cursor.style.left = (rectSense.left + rectSense.width - 1) + "px";
		} else {
			this.Hide(true);
		}
	}

	Blink() {
		if(this.cursor.style.display == "none") {
			this.cursor.style.display = "block";
		} else {
			this.cursor.style.display = "none";
		}

		if(this.blinkingInterval!=undefined) {
			clearInterval(this.blinkingInterval);
		}
		this.blinkingInterval = setInterval(() => {
			if(this.cursor.style.display == "none") {
				this.cursor.style.display = "block";
			} else {
				this.cursor.style.display = "none";
			}
		}, 500);
	}

	Hide(keepSelectionVisible = false) {
		this.cursor.style.display = "none";
		clearInterval(this.blinkingInterval);
		if(!keepSelectionVisible) {
			this.ClearSelection();	
		}
	}

	SetStartBase(base, mouseX) {
		let antiSenseBase = undefined;
		let senseBase = undefined;
		if(base.isAntisenseStrand) {
			antiSenseBase = base;
			senseBase = this.dna.GetBaseFromAntiBase(base);
		} else {
			senseBase = base;
			antiSenseBase = this.dna.GetAntiBaseFromBase(base);
		}

		
		let rectSense = senseBase.domElement.getBoundingClientRect();
		if(mouseX < (rectSense.left + 5)) {
			//left - we reference always the base before
			let pos = senseBase.position - 1;
			if(pos<0) {
				this.ShowOnTop();
				this.startBase = undefined;
			} else {
				this.startBase = this.dna.senseStrand[pos];	
			}
		} else {
			//right
			let pos = senseBase.position;
			this.startBase = this.dna.senseStrand[pos];
		}

		let basesPerLine = this.dna.basesPerLine;
		if(this.startBase!=undefined) {
			this.startBaseLine = parseInt(this.startBase.position / basesPerLine);
		} else {
			this.startBaseLine = 0;
		}
		
	}

	OverWriteStartBase(base) {
		this.cursorIsOnTop = false;
		if(base != undefined) {
			this.startBase = base;
			let basesPerLine = this.dna.basesPerLine;
			this.startBaseLine = parseInt(this.startBase.position / basesPerLine);	
		} else {
			this.startBase = undefined;
			this.startBaseLine = 0;
		}
		
	}

	SelectTillCoordinates(x,y) {
		this.Hide();

		if(this.startBase!=undefined) {	
			let basesPerLine = this.dna.basesPerLine;
			let cellWidth = this.dna.cellWidth;

			if(this.endBaseLine == this.startBaseLine) {
				
				let rectSense = this.startBase.domElement.getBoundingClientRect();
				let dist = x - rectSense.x;

				let linePosition = this.startBase.position % basesPerLine;

				let start = 0;
				let end = 0;
				let go = true;
				if(dist>0) {
					//selecting right
					let numbOfBases = parseInt(dist/cellWidth)+1;
					start = this.startBase.position;
					end = this.startBase.position + numbOfBases;
					if(linePosition + numbOfBases <= basesPerLine) {
						//still on the same line
					} else {
						go = false;
					}
				} else {
					//selecting left -- _selectBases will swap end with start!
					let numbOfBases = -1 * parseInt(dist/cellWidth);
					numbOfBases = numbOfBases+1;
					end = this.startBase.position - numbOfBases;
					if(end<0) {
						end = 0;
					}
					start = this.startBase.position;
					if(linePosition - numbOfBases >= 0) {
						//still on the same line
					} else {
						go = false;
					}
				}

				if(go) {
					this._selectBases(start, end);				
				}
			} else {
				let start = this.startBase.position;

				let end = 0;
				let rectSense = this.endBase.domElement.getBoundingClientRect();
				let dist = x - rectSense.x;
				let go = true;
				if(dist > 0) {
					//selecting right
					let numbOfBases = parseInt(dist/cellWidth)+1;
					end = this.endBase.position + numbOfBases;
					let linePosition = this.endBase.position % basesPerLine;
					if(linePosition + numbOfBases <= basesPerLine) {
						//still on the same line
					} else {
						go = false;
					}
				} else {
					//selecting left
					let numbOfBases = -1 * parseInt(dist/cellWidth);
					end = this.endBase.position - numbOfBases;

				}

				if(go) {
					this._selectBases(start, end);				
				}
			}
		}
	}

	SelectTillBase(endBase) {
		if(endBase!=undefined) {
			this.endBase = endBase;
			let basesPerLine = this.dna.basesPerLine;
			this.endBaseLine = parseInt(endBase.position / basesPerLine);

			let start = this.startBase.position;
			let end = endBase.position;

			this._selectBases(start, end);
		}
	}

	SelectAll() {
		this.Hide();
		this.OverWriteStartBase(this.dna.senseStrand[0]);
		this._selectBases(this.dna.senseStrand.length, 0);
	}


	_selectBases(start, end) {
		if(end > start) {
			let basesPerLine = this.dna.basesPerLine;

			this.endBase = this.dna.senseStrand[end-1];		
			this.endBaseLine = parseInt(this.endBase.position / basesPerLine);

			this.ClearSelection();
			let add = false;
			this.dna.selectedBases = this.dna.senseStrand.slice(start+1, end);
			this.ShowSelection();
		} else {
			this.ClearSelection();
			this.dna.selectedBases = this.dna.senseStrand.slice(end, start + 1);
			this.ShowSelection();
		}

		
	}

	ShowSelection() {
		this.dna.selectedBases.forEach((b) => {
			b.domElement.style.backgroundColor = "rgba(48, 183, 232,1)";
			b.domElement.style.color = "#ffffff";
			let anti = this.dna.GetAntiBaseFromBase(b);
			anti.domElement.style.backgroundColor = "rgba(48, 183, 232, 1)";
			anti.domElement.style.color = "#ffffff";
		});
	}

	ClearSelection() {
		this.dna.selectedBases.forEach((b) => {
			if(b!=undefined) {
				b.domElement.style.backgroundColor = "#ffffff";
				b.domElement.style.color = b.color;
				let anti = this.dna.GetAntiBaseFromBase(b);
				if(anti!=undefined) {
					anti.domElement.style.backgroundColor = "#ffffff";
					anti.domElement.style.color = anti.color;	
				}
			}
		});
		this.dna.selectedBases = [];
	}

	Move(where) {
		if(where == "left") {
			if(this.startBase == undefined) {
				this.ShowOnTop();
			} else {
				let position = this.startBase.position - 1;
				if(position<0) {
					this.ShowOnTop();
				} else {
					this.OverWriteStartBase(this.dna.senseStrand[position]);
					this.Show();
				}
			}	
		} else if(where == "right") {
			let position = 0;
			if(this.startBase != undefined) {
				position = this.startBase.position + 1;
			}
			if(position >= this.dna.senseStrand.length) {
				position = this.dna.senseStrand.length-1;
			}
			this.OverWriteStartBase(this.dna.senseStrand[position]);
			this.Show();
		} else if(where == "up") {
			if(this.startBase != undefined) {
				let basesPerLine = this.dna.basesPerLine;
				let linePosition = this.startBase.position % basesPerLine;
				let newLine = this.startBaseLine - 1;
				if(newLine<0) {
					newLine = 0;
				}

				let position = basesPerLine * newLine + linePosition;
				this.OverWriteStartBase(this.dna.senseStrand[position]);
				this.Show();
			}
		} else if(where == "down") {
			if(this.startBase != undefined) {
				let basesPerLine = this.dna.basesPerLine;
				let linePosition = this.startBase.position % basesPerLine;
				let newLine = this.startBaseLine + 1;
				let totNumbOfLines = parseInt(this.dna.senseStrand.length / basesPerLine);
				
				if(newLine >= totNumbOfLines) {
					newLine = totNumbOfLines-1;
				}

				let position = basesPerLine * newLine + linePosition;
				this.OverWriteStartBase(this.dna.senseStrand[position]);
				this.Show();
			}
		}
	}





}