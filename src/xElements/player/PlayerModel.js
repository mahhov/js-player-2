const EventEmitter = require('events');
const Debouncer = require('../../services/utils/Debouncer');
const AudioTrack = require('../../services/AudioTrack');

class PlayerModel extends EventEmitter {
	#updateVideoDataDebouncer;
	#audioTrack;

	#video;
	#loaded;

	constructor() {
		super();
		this.#updateVideoDataDebouncer = new Debouncer(500, (...args) => this.#updateVideoData(...args));
		this.#audioTrack = new AudioTrack();
		this.#audioTrack.on('time', () => this.emit('time-change'));
		this.#audioTrack.on('end', () => {
			if (this.#loaded)
				this.emit('end');
		});
	}

	set video(video) {
		this.#video?.unload();
		this.#video?.removeAllListeners('data');
		this.#updateVideoDataDebouncer.cancel();
		this.#video = video;
		this.#loaded = false;
		this.paused = true;
		this.#audioTrack.time = 0;

		let first = true;
		let updateVideoData = () => {
			this.#updateVideoDataDebouncer.queue(video, first);
			first = false;
		};

		if (video.done)
			updateVideoData();
		else {
			if (video.buffer.buffer.byteLength)
				updateVideoData();
			video.on('data', updateVideoData);
		}
	}

	async #updateVideoData(video, first) {
		let loaded = video.loaded.done;
		let audioData = await this.#audioTrack.readAudioData(video.buffer.buffer);
		if (this.#video !== video)
			return;
		this.#loaded = loaded;
		this.#audioTrack.audioData = audioData;
		if (first)
			this.paused = false;
		else if (!this.paused) {
			this.paused = true;
			this.paused = false;
		}
	}

	get paused() {
		return this.#audioTrack.paused;
	}

	set paused(paused) {
		this.#audioTrack.paused = paused;
		this.emit('pause-change');
	}

	get time() {
		return this.#audioTrack.time;
	}

	set time(timeS) {
		this.#audioTrack.time = timeS;
		this.emit('time-change');
	}

	seek(deltaS) {
		this.time += deltaS;
	}

	get progress() {
		return this.time / this.duration;
	}

	set progress(progress) {
		this.time = progress * this.#audioTrack.duration;
	}

	get duration() {
		return this.#audioTrack.duration;
	}

	get analyzer() {
		return this.#audioTrack.analyzer;
	}
}

module.exports = PlayerModel;
