const {sleep} = require('./utils');

class Debouncer {
	#delay;
	#handler;
	#syncOnly;
	#queued;
	#wait;

	constructor(delay, handler, syncOnly = false) {
		this.#delay = delay;
		this.#handler = handler;
		this.#syncOnly = syncOnly;
		this.#queued = false;
		this.#wait = null;
	}

	// 1st set of args will be used
	async queue(...args) {
		if (this.#wait && (this.#syncOnly || this.#queued))
			return;

		if (this.#wait) {
			this.#queued = true;
			await this.#wait;
			if (!this.#queued)
				return;
			this.#queued = false;
		}

		this.#wait = Promise.resolve(this.#handler(...args))
			.then(() => sleep(this.#delay));
		await this.#wait;
		this.#wait = null;
	}

	cancel() {
		this.#queued = false;
		this.#wait = null;
	}
}

module.exports = Debouncer;
