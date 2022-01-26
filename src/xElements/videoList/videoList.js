const {importUtil, XElement} = require('xx-element');
const {template, name} = importUtil(__filename);
const {rotatingSlice, updateListEl} = require('../../services/utils/utils');
const Debouncer = require('../../services/utils/Debouncer');
const Searcher = require('../../services/Searcher');

customElements.define(name, class extends XElement {
	#updateDebouncer;

	static get attributeTypes() {
		return {
			videoList: {type: XElement.PropertyTypes.object},
		};
	}

	static get htmlTemplate() {
		return template;
	}

	connectedCallback() {
		this.$('#query').addEventListener('input', () => this.#updateList());
		this.#updateDebouncer = new Debouncer(1000, () => this.#updateList());
	}

	set videoList(videoList) {
		videoList.on('change-list', () => this.#updateDebouncer.queue());
		videoList.on('change-current', () => this.#updateList());
		this.#updateDebouncer.queue();
	}

	#updateList() {
		let searcher = new Searcher(this.$('#query').value, false);
		let videos = this.$('#query').value ?
			this.videoList.videos
				.filter((video) => searcher.test(`${video.title} ${video.id}`))
				.filter((_, i) => i < 99) :
			rotatingSlice(this.videoList.videos, this.videoList.currentIndex - 6, this.videoList.currentIndex + 18);

		updateListEl(this.$('#list'), videos,
			() => {
				let line = document.createElement('x-video-list-line');
				line.addEventListener('click', () => this.emit('select', line.id));
				return line;
			},
			(line, video) => {
				line.id = video.id;
				line.title = video.title;
				line.downloadStatus = ''; // todo
				line.classList.toggle('selected', video.id === this.videoList.currentVideo?.id);
			});
		this.$('#count').textContent = this.videoList.videos.length;
	}
});
