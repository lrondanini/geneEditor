
export default class IdManager {

	constructor(allKeys) {
		this.allKeys = {};
		if(allKeys!=undefined) {
			allKeys.forEach(function(k) {
				this.allKeys[k] = true;
			});
		}
	}

	GetNew() {
		let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		let f = false;
		let idr = "";

		while(!f) {
			for (let i = 0; i < 5; i++) {
	    		idr += possible.charAt(Math.floor(Math.random() * possible.length));
			}

			if(this.allKeys[idr] == undefined) {
				this.allKeys[idr] = true;
				f = true;
			}
		}

		return idr;
	}

	Release(key) {
		delete this.allKeys[key];
	}

	/* if key already exists...creates a new one */
	VerifyAndRegister(key) {
		if(this.allKeys[key]) {
			key = this.GetNew();
		}
		this.allKeys[key] = true;
		return key;
	}

	Reset() {
		this.allKeys = {};
	}

}