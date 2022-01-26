const {importUtil, XElement} = require('xx-element');
const {template, name} = importUtil(__filename);

customElements.define(name, class extends XElement {
	static get attributeTypes() {
		return {
			player: {type: XElement.PropertyTypes.object},
		};
	}

	static get htmlTemplate() {
		return template;
	}

	connectedCallback() {
	}

	set player(player) {
		this.bubble(this.$('#controls'), 'progress-set');
		this.bubble(this.$('#controls'), 'pause-toggle');
		this.bubble(this.$('#controls'), 'prev');
		this.bubble(this.$('#controls'), 'next');
		this.bubble(this.$('#controls'), 'seek-backward');
		this.bubble(this.$('#controls'), 'seek-forward');

		player.on('pause-change', () =>
			this.#updateControlsPaused());
		player.on('time-change', () =>
			this.#updateControlsTimes());
		this.#updateControlsPaused();
		this.#updateControlsTimes();

		this.$('#visualizer').analyzer = player.analyzer;
	}

	#updateControlsPaused() {
		this.$('#controls').paused = this.player.paused;
	}

	#updateControlsTimes() {
		this.$('#controls').time = this.player.time;
		this.$('#controls').duration = this.player.duration;
		this.$('#controls').progress = this.player.progress;
	};
});
