import Segment from './Segment';

export default class Feature {
	constructor(dna, id, name, direction, start, end, color, segments=[]) {
		this.dna = dna;
		this.id = id;
		this.name = name;
		this.direction = direction; //nondirectional | forward | reverse | bidirectional
		this.start = start;
		this.end = end;
		this.color = color;
		this.segments = segments;
	}

	/* 
		Remove is not really needed....when all the bases are removed system won't be able to draw it anyway 
		BUT, it's useful to not have garbage in the details of this dna
	*/
	RemoveBase(base) {
		this.end = this.end - 1;
		if(this.end < this.start) {
			this.dna.RemoveFeature(this);
		} else {

			let tmp = []
			this.segments.forEach((seg) => {
				if(seg.start <= base.position && seg.end >= base.position) {
					seg.end = seg.end - 1;
					if(seg.end < seg.start) {
						//skip == remove
					} else {
						tmp.push(seg);
					}
				} else {
					tmp.push(seg);
				}
			});
			this.segments = tmp;
		}		
	}

	toJson() {
		let _segments = [];
		this.segments.forEach((seg) => {
			_segments.push(seg.toJson())
		});
		return {
			id: this.id,
			name: this.name,
			direction: this.direction,
			start: this.start,
			end: this.end,
			color: this.color,
			segments: _segments
		}
	}

	static FromJson(dna, json) {
		let _segments = [];
		json.segments.forEach((seg) => {
			_segments.push(Segment.FromJson(dna, seg));
		});
		let res = new Feature(dna, json.id, json.name, json.direction, json.start, json.end, json.color, _segments);
		dna.RegisterFeature(res);
		return res;
	}

	static CreateNew(dna, name, direction, selectedBases, color) {
		let res = new Feature(dna, dna.GenereateNewBaseId(), name, direction, 0, 0, color);

		let f = true;
		let startPos = 0;
		let endPos = 0;

		selectedBases.forEach(function(base) {
			if(f) {
				startPos = base.position;
				f = false;
			}
			endPos = base.position;			
			base.AddFeature(res.id);
		});

		res.start = startPos;
		res.end = endPos;
		
		dna.RegisterFeature(res);

		return res;
	}
}