const EventEmitter = require('events');
const {randInt} = require('../../services/utils/utils');

class VideoListModel extends EventEmitter {
	#videos;
	#index;

	constructor() {
		super();
		this.#videos = [];
		this.#index = 0; // equals #videos.length when unset
	}

	addPlaylist(playlist) {
		playlist.videos.each(video => this.addVideo(video));
	}

	removePlaylist(playlist) {
		// todo
	}

	addVideo(video) {
		let index = randInt(0, this.#videos.length + 1);
		if (this.#index === this.#videos.length || index <= this.#index)
			this.#index++;
		this.#videos.splice(index, 0, video);
		this.emit('change-list');
	}

	get videos() {
		return this.#videos;
	}

	set currentId(id) {
		this.#index = this.#videos.findIndex(video => video.id === id);
		this.emit('change-current', this.currentVideo);
	}

	firstVideo() {
		this.#index = 0;
		this.emit('change-current', this.currentVideo);
	}

	prevVideo() {
		this.#index = (this.#index || this.#videos.length) - 1;
		this.emit('change-current', this.currentVideo);
	}

	nextVideo() {
		this.#index = (this.#index + 1) % this.#videos.length;
		this.emit('change-current', this.currentVideo);
	}

	get currentIndex() {
		return this.#index;
	}

	get currentVideo() {
		return this.#videos[this.#index];
	}
}

module.exports = VideoListModel;
