const EventEmitter = require('events');
const {clamp} = require('./utils/utils');

const BAR_COUNT = 32 * 4; // todo duplicate constant, also defined in audioVisualizer

class AudioTrack extends EventEmitter {
	#audioCtx;
	#analyzer;
	#paused;
	#offsetTime;

	#audioData;
	#source;
	#timeIntervalId;
	#sourceEndListener;

	constructor() {
		super();
		this.#audioCtx = new AudioContext();
		this.#analyzer = this.#audioCtx.createAnalyser();
		this.#analyzer.fftSize = BAR_COUNT * 2;
		this.#paused = true;
		this.#offsetTime = 0;
	}

	get analyzer() {
		return this.#analyzer;
	}

	readAudioData(fileBuffer) {
		return this.#audioCtx.decodeAudioData(fileBuffer);
	}

	set audioData(audioData) {
		this.#audioData = audioData;
	}

	get paused() {
		return this.#paused;
	}

	set paused(paused) {
		paused ? this.#pause() : this.#play();
	}

	#play() {
		if (!this.#paused)
			return;
		if (!this.#audioData) {
			this.emit('end');
			return;
		}

		this.#paused = false;
		this.#source = this.#audioCtx.createBufferSource();
		this.#source.buffer = this.#audioData;
		this.#source.connect(this.#audioCtx.destination);
		this.#source.connect(this.#analyzer);
		this.#source.start(0, this.#offsetTime);
		this.#offsetTime -= this.#audioCtx.currentTime;

		this.#timeIntervalId = setInterval(() => this.emit('time'), 100);
		this.#source.addEventListener('ended', this.#sourceEndListener = () => {
			clearInterval(this.#timeIntervalId);
			this.emit('end');
		});
	}

	#pause() {
		if (this.#paused)
			return;

		this.#paused = true;
		this.#source.removeEventListener('ended', this.#sourceEndListener);
		this.#source.stop();
		this.#source.disconnect();
		this.#offsetTime += this.#audioCtx.currentTime;

		clearInterval(this.#timeIntervalId);
	}

	get time() {
		return this.#audioCtx ?
			this.#paused ?
				this.#offsetTime :
				this.#offsetTime + this.#audioCtx.currentTime :
			0;
	}

	set time(time) {
		if (isNaN(time))
			return;
		let paused = this.#paused;
		this.#pause();
		this.#offsetTime = clamp(time, 0, this.duration);
		if (!paused)
			this.#play();
	}

	get duration() {
		return this.#audioData ? this.#audioData.duration : 0;
	}
}

module.exports = AudioTrack;
