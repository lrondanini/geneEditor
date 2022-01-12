export default class Segment {
	constructor(dna, id, idFeature, name, start, end, color) {
		this.dna = dna;
		this.id = id;
		this.idFeature = idFeature;
		this.name = name;
		this.start = start;
		this.end = end;
		this.color = color;
	}

	toJson() {
		return {
			id: this.id,
			idFeature: this.idFeature,
			name: this.name,
			start: this.start,
			end: this.end,
			color: this.color
		}
	}

	static FromJson(dna, json) {
		return new Segment(dna, json.id, json.idFeature, json.name, json.start, json.end, json.color);
	}

	static CreateNew(dna, name, idFeature, selectedBases, color) {
		let res = new Segment(dna, dna.GenereateNewBaseId(), idFeature, name, 0, 0, color);

		let f = true;
		let startPos = 0;
		let endPos = 0;
		selectedBases.forEach(function(b) {
			if(f) {
				startPos = b.position;
				f = false;
			}

			endPos = b.position;
		});

		res.start = startPos;
		res.end = endPos;
		
		dna.GetFeatureById(idFeature).segments.push(res);

		return res;
	}
}