var editorInstance = undefined;

function Debug(pretty) {
	editorInstance.Debug(pretty);
}

function GenerateDna(length) {
	let res = "";

	while(res.length<length) {
		let k = Math.floor(Math.random() * 4) + 1
		if(k==1) {
			res += "T";
		} else if(k==2) {
			res += "G";
		} else if(k==3) {
			res += "C";
		} else if(k==4) {
			res += "A";
		}
	}

	return res;
}

(function() {

	let options = {
		sequence: [],
		basesPerLine: 60,
		onChange: function(status) {
			//console.log(status);
		}
	}

	editorInstance = new GeneEditor.GeneEditor("editor", options);

	editorInstance.LoadFromString(GenerateDna(400));
	
})();

window.Debug = Debug;
