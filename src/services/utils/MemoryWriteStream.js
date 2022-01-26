const stream = require('stream');

class MemoryWriteStream extends stream.Writable {
	#chunks;

	constructor() {
		super();
		this.#chunks = [];
	}

	_write(chunk, enc, next) {
		this.#chunks.push(chunk);
		next();
	}

	get buffer() {
		return Buffer.concat(this.#chunks);
	}
}

module.exports = MemoryWriteStream;
