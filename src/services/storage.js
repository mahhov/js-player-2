const {tryJsonParse} = require('./utils/utils');

class Storage {
	#key;

	constructor(key) {
		this.#key = key;
	}

	read() {
		return tryJsonParse(localStorage.getItem(this.#key));
	}

	write(value) {
		localStorage.setItem(this.#key, JSON.stringify(value));
	}
}

module.exports = Storage;
