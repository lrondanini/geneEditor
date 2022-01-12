
export default class HistoryManager {

	constructor() {
		this.history = [];
		this.index = 0;
		this.wordCounter = 0;
	};

	Push(params) {
		this.history[this.index] = params;
		this.index++;
		this.history = this.history.slice(0, this.index);
	}

	Undo() {
		let i =  this.index - 2; //index is always pointing to next (new/empty)
		let r = undefined;

		if(i < 0) {
			i = 0;
			this.index = 1; //always point to the next
			r = this.history[i];
		} else {
			r = this.history[i];
			this.index--;
		} 

		return r;
	}

	Redo() {
		let i =  this.index; //index is always pointing to next (new/empty)
		if(i > this.history.length-1) {
			i = this.history.length-1;
		}
		let r = this.history[i];
		this.index = i + 1;
		return r;
	}
}
