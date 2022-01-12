import DNA from './model/dna';

export default class GeneEditor {
	constructor(idNodeContainer, options) {
		this.sequence = options.sequence;
		this.basesPerLine = options.basesPerLine;
		this.onChange = options.onChange;
		this.Init(idNodeContainer);
	}	

	Init(idNodeContainer) {
		this.container = document.getElementById(idNodeContainer);
		this.dna = new DNA(this.container, this.sequence, this.basesPerLine, this.onChange);
		this.dna.Draw();
	}

	LoadFromString(str) {
		this.dna.LoadFromString(str);
	}
}