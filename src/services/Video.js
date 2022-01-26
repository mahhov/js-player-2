const EventEmitter = require('events');
const ytdl = require('ytdl-core');
const MemoryWriteStream = require('./utils/MemoryWriteStream');
const PromiseW = require('./utils/PromiseW');

class Video extends EventEmitter {
	#streamCache;
	#writeStream;
	#writePromise;

	constructor(id, title) {
		super();
		this.id = id;
		this.title = title;
	}

	get #stream() {
		return this.#streamCache = this.#streamCache || ytdl(this.id, {filter: 'audioonly'});
	}

	unload() {
		this.#streamCache?.destroy();
		this.#streamCache = null;
		this.#writeStream = null;
		this.#writePromise = null;
	}

	load() {
		if (!this.#writePromise || this.#writePromise.rejected) {
			this.#writeStream = new MemoryWriteStream();
			this.#writePromise = new PromiseW();
			let onError = error => {
				this.#writePromise.reject(error);
				this.#streamCache = null;
			};
			try {
				this.#stream.pipe(this.#writeStream);
				this.#stream.on('error', onError);
				this.#stream.on('data', () => this.emit('data'));
				this.#stream.on('end', () => this.#writePromise.resolve());
			} catch (error) {
				onError(error);
			}
		}
	}

	get loaded() {
		return this.#writePromise;
	}

	get buffer() {
		this.load();
		return this.#writeStream.buffer;
	}
}

module.exports = Video;
