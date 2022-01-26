class PromiseW extends Promise {
	#resolve;
	#reject;

	constructor(exec = () => 0) {
		let resolve, reject;
		super((res, rej) => {
			exec(res, rej);
			resolve = res;
			reject = rej;
		});

		this.#resolve = resolve;
		this.#reject = reject;

		this.resolved = false;
		this.rejected = false;
	}

	resolve(value) {
		if (this.done)
			return;
		this.resolved = true;
		this.#resolve(value);
	}

	reject(value) {
		if (this.done)
			return;
		this.rejected = true;
		this.#reject(value);
	}

	get done() {
		return this.resolved || this.rejected;
	}
}

module.exports = PromiseW;
