import Cursor from './Cursor';
import ContextMenu from './ContextMenu';


export default class EventsManager {
	constructor(sequencialManager) {
		this.sequencialManager = sequencialManager;
		this.dna = this.sequencialManager.dna;
		this.nodeContainer = this.sequencialManager.viewerContainer;


		this._listeners = {
			onMouseDown: (e) => this.onMouseDown(e),
			onMouseMove: (e) => this.onMouseMove(e),
			onMouseUp: (e) => this.onMouseUp(e),
			onScroll: (e) => this.onScroll(e),
			onContextMenu: (e) => this.onContextMenu(e),
			onKeyDown: (e) => this.onKeydown(e),
			onKeyUp: (e) => this.onKeyUp(e),
			onPaste: (e) => this.onPaste(e),
		}

		this.cursor = new Cursor(this.dna);
		this.contextMenu = new ContextMenu(this.dna, this.sequencialManager.featuresManager);
		this.Init();
	}


	Init() {
		this.nodeContainer.setAttribute("tabindex","0");
		this.nodeContainer.focus();
		this.nodeContainer.addEventListener("mousedown", this._listeners.onMouseDown);
		this.nodeContainer.addEventListener("mousemove", this._listeners.onMouseMove);
		this.nodeContainer.addEventListener("mouseup", this._listeners.onMouseUp);
		this.nodeContainer.addEventListener("contextmenu", this._listeners.onContextMenu);
		this.nodeContainer.addEventListener("keydown", this._listeners.onKeyDown);
		this.nodeContainer.addEventListener("keyup", this._listeners.onKeyUp);
		document.addEventListener("paste", this._listeners.onPaste); 
		this.nodeContainer.parentNode.parentNode.addEventListener("scroll", this._listeners.onScroll);
	}

	Destroy() {
		this.nodeContainer.removeEventListener("mousedown", this._listeners.onMouseDown);
		this.nodeContainer.removeEventListener("mousemove", this._listeners.onMouseMove);
		this.nodeContainer.removeEventListener("mouseup", this._listeners.onMouseUp);
		this.nodeContainer.removeEventListener("contextmenu", this._listeners.onContextMenu);
		this.nodeContainer.removeEventListener("keydown", this._listeners.onKeyDown);
		this.nodeContainer.removeEventListener("keyup", this._listeners.onKeyUp);
		document.removeEventListener("paste", this._listeners.onPaste);
		this.nodeContainer.parentNode.parentNode.removeEventListener("scroll", this._listeners.onScroll);
		this.cursor.Destroy();
		this.contextMenu.Destroy();
	}

	//to prevent normal text selection
	_clearTextSelection() {
		if (window.getSelection) {
			if(window.getSelection().empty) {  // Chrome
		    	window.getSelection().empty();
		  	} else if (window.getSelection().removeAllRanges) {  // Firefox
		    	window.getSelection().removeAllRanges();
		  	}
		} else if (document.selection) {  // IE?
		  	document.selection.empty();
		}
	}

	onMouseDown(e) {
		this.nodeContainer.focus();
		this.contextMenu.Hide();
		if(e.button == 0) {
		    // left click
		    this.sequencialManager.HideBasePosition();

			this.isMouseDown = true;
			this._clearTextSelection();
			this.cursor.Hide();
			this.selecting = false;
			this.showCursor = false;
			let box = e.srcElement;
			if(box.getAttribute("ge-type") != undefined) {
				if(box.getAttribute("ge-type") == "base") {
					let base = this.dna.GetBaseById(box.getAttribute("ge-id"));
					this.cursor.SetStartBase(base, e.pageX);
					this.showCursor = true;
				}
			}
		} else {
			//right click
			this.cursor.Hide(true);			
		}
				
	}

	onMouseMove(e) {	
		this._clearTextSelection();

		

		if(this.basePositionTimeout!=undefined) {
			clearTimeout(this.basePositionTimeout);
		}

		if(this.isMouseDown) {			
			this.selecting = true;
			//this.dna.nodeContainer.parentNode.scrollTop
			let selectByCoords = true;
			let box = e.srcElement;
			if(box.getAttribute("ge-type") != undefined) {
				if(box.getAttribute("ge-type") == "base") {
					let base = this.dna.GetBaseById(box.getAttribute("ge-id"));
					this.basePositionTimeout = setTimeout(() => {
						this.sequencialManager.ShowBasePosition(base.position, e.pageX, e.pageY);
					});

					selectByCoords = false;
					this.cursor.SelectTillBase(base);
				}
			}

			if(selectByCoords) {
				this.cursor.SelectTillCoordinates(e.pageX, e.pageY);	
			}
		} else {
			this.sequencialManager.HideBasePosition();
			let box = e.srcElement;
			if(box.getAttribute("ge-type") != undefined) {
				if(box.getAttribute("ge-type") == "base") {
					let base = this.dna.GetBaseById(box.getAttribute("ge-id"));
					this.basePositionTimeout = setTimeout(() => {
						this.sequencialManager.ShowBasePosition(base.position, e.pageX, e.pageY);
					}, 20);
				}
			}			
		}
		
	}

	onMouseUp(e) {
		this.isMouseDown = false;
		this._clearTextSelection();
		if(!this.selecting && this.showCursor) {
			this.cursor.Show();
		} 
	}

	onScroll(e) {
		this.cursor.SetCursorPosition();
	}


	onContextMenu(e) {
		if(this.dna.selectedBases.length>0) {
			this.contextMenu.Show(e);
		}

		e.preventDefault();
		e.stopPropagation();
		return false;
	}

	HideCursor() {
		this.cursor.Hide();
	}

	DeleteBases(action) {
		let position = undefined;
		if(this.dna.selectedBases.length>0) {
			position = this.dna.DeleteSelectedBases();
		} else {
			if(action == "Backspace") {
				//Backspace
				position = this.cursor.startBase.position;
			} else {
				//Delete
				position = this.cursor.startBase.position+1;				
			}
			this.dna.DeleteBase(position);			
		}		
		this.cursor.OverWriteStartBase(this.dna.senseStrand[position - 1]);
		this.cursor.Show();
	}

	onKeydown(event) {
		let key = event.key;

		switch(key) {
			case "Down": // IE/Edge specific value
		    case "ArrowDown":	
		    	if(event.shiftKey) {
		    		//not supported yet
		    		//this.cursor.SelectWithKeyboard("down");
		    	} else {
		    		this.cursor.Move("down");	
		    	}		    	
			    break;
		    case "Up": // IE/Edge specific value
		    case "ArrowUp":
		    	if(event.shiftKey) {
		    		//this.cursor.SelectWithKeyboard("up");
		    	} else {
		    		this.cursor.Move("up");	
		    	}
		    	break;
		    case "Left": // IE/Edge specific value
		    case "ArrowLeft":
		    	if(event.shiftKey) {
		    		//this.cursor.SelectWithKeyboard("left");
		    	} else {
		    		this.cursor.Move("left");	
		    	}
		    	break;
		    case "Right": // IE/Edge specific value
		    case "ArrowRight":
		    	if(event.shiftKey) {
		    		//this.cursor.SelectWithKeyboard("right");
		    	} else {
		    		this.cursor.Move("right");	
		    	}
		    	break;
		    case "Enter":		    	
		    	event.preventDefault();
		    	event.stopPropagation();	    	
		      	break;
		    case "Esc": // IE/Edge specific value
		    case "Escape":
		    	this.cursor.Hide();
		    	this.contextMenu.Hide();
		    	break;
		      	break;
		    case "Backspace":
		    	this.DeleteBases("Backspace");
				event.preventDefault();
    			event.stopPropagation();
		      	break;
		    case "Delete":
		    	this.DeleteBases("Delete");		    	
				event.preventDefault();
    			event.stopPropagation();
		      	break;		    
		    default:
		    	if(event.metaKey && !event.shiftKey && key=='z') {
		    		//undo mac
		    		this.dna.Undo();
		    		event.preventDefault();
		    		event.stopPropagation();

		    	} else if(event.shiftKey && event.metaKey && key=='z') {
		    		//redo mac
		    		this.dna.Redo();
		    		event.preventDefault();
		    		event.stopPropagation();

		    	} else if(event.ctrlKey && !event.shiftKey && key=='z') {
		    		//undo windows
		    		this.dna.Undo();
		    		event.preventDefault();
		    		event.stopPropagation();
		    	} else if(event.ctrlKey && event.shiftKey && key=='z') {
		    		//redo windows
		    		this.dna.Redo();
		    		event.preventDefault();
		    		event.stopPropagation();
		    	} else if((event.metaKey || event.ctrlKey) && key=='a') {
		    		//select all
		    		this.cursor.SelectAll();
		    		event.preventDefault();
    				event.stopPropagation();	
		    	} else if((event.metaKey || event.ctrlKey) && key=='c') {
		    		//copy
		    		this.dna.CopyToClipBoard();
		    		event.preventDefault();
    				event.stopPropagation();
		    	} else if((event.metaKey || event.ctrlKey) && key=='x') {
		    		//cut
		    		this.dna.CopyToClipBoard();
		    		this.DeleteBases("Delete");
		    		event.preventDefault();
    				event.stopPropagation();
		    	} 
		    	
		    	if(!event.metaKey && !event.ctrlKey && !event.altKey) { // && !event.shiftKey - leave it out or it will behave strangely (type 'One' (no ') in an empty doc)
		    		if(key.toLowerCase() == "t" 
		    			|| key.toLowerCase() == "c" 
						|| key.toLowerCase() == "g" 
						|| key.toLowerCase() == "a"
						|| key.toLowerCase() == "n"
						|| key.toLowerCase() == "?") {
						
						let position = 0;
						if(!this.cursor.cursorIsOnTop) {
							if(this.cursor.startBase!=undefined) {
								position = this.cursor.startBase.position + 1;	
							}
							if(this.dna.selectedBases.length>0) {
								position = this.dna.DeleteSelectedBases();
							}
						}

						let newBase = this.dna.AddBaseFromChar(key.toUpperCase(), true, position);
						this.cursor.OverWriteStartBase(newBase);
						this.cursor.Show();
						event.preventDefault();
		    			event.stopPropagation();
					}
		    	} 
		    	break;
		}
	}

	onKeyUp(event) {

	}


	onPaste(event) {		
		let pastedContent = event.clipboardData.getData('text');
		
		if(/^[TGCAN?]+$/.test(pastedContent)) {
			
			if(this.cursor.startBase !=undefined) {
				let position = this.cursor.startBase.position;
				this.DeleteBases("Delete");
				this.dna.AddBasesAtCursor(pastedContent, position+1);
				this.cursor.Show(position + pastedContent.length);
			}
			
		} 

		event.preventDefault();
	    event.stopPropagation();
	}
}