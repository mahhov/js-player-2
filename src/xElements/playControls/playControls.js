const {XElement, importUtil} = require('xx-element');
const {template, name} = importUtil(__filename);
const Debouncer = require('../../services/utils/Debouncer');
const shortcuts = require('../../services/shortcuts');

customElements.define(name, class PlayControls extends XElement {
	static get attributeTypes() {
		return {
			time: {type: XElement.PropertyTypes.number},
			duration: {type: XElement.PropertyTypes.number},
			progress: {type: XElement.PropertyTypes.number},
			paused: {type: XElement.PropertyTypes.boolean},
		};
	}

	static get htmlTemplate() {
		return template;
	}

	connectedCallback() {
		this.bubble(this.$('#progress'), 'progress-set');
		this.bubble(this.$('#pause-toggle'), 'click', 'pause-toggle');
		this.bubble(this.$('#prev'), 'click', 'prev');
		this.bubble(this.$('#next'), 'click', 'next');

		shortcuts.addListenerKeydown(({key}) => {
			switch (key) {
				case 'ArrowLeft':
					this.emit('prev');
					break;
				case 'ArrowRight':
					this.emit('next');
					break;
				case 'ArrowDown':
				case ' ':
					this.emit('pause-toggle');
					break;
				case ',':
					this.emit('seek-backward');
					break;
				case '.':
					this.emit('seek-forward');
					break;
			}
		});

		let prevDebouncer = new Debouncer(1000, () => this.emit('prev'), true);
		let nextDebouncer = new Debouncer(1000, () => this.emit('next'), true);
		shortcuts.addGlobalShortcutListener(shortcuts.globalShortcutEvents.PREV, () => prevDebouncer.queue());
		shortcuts.addGlobalShortcutListener(shortcuts.globalShortcutEvents.NEXT, () => nextDebouncer.queue());
		shortcuts.addGlobalShortcutListener(shortcuts.globalShortcutEvents.PAUSE, () => this.emit('pause-toggle'));
		shortcuts.addGlobalShortcutListener(shortcuts.globalShortcutEvents.BACKWARD, () => this.emit('seek-backward'));
		shortcuts.addGlobalShortcutListener(shortcuts.globalShortcutEvents.FORWARD, () => this.emit('seek-forward'));
	}

	set time(time) {
		this.$('#progress').preValue = PlayControls.timeFormat(time);
	}

	set duration(duration) {
		this.$('#progress').postValue = PlayControls.timeFormat(duration);
	}

	set progress(progress) {
		this.$('#progress').progress = progress;
	}

	set paused(paused) {
		this.$('#pause-toggle').classList.toggle('paused', paused);
	}

	static timeFormat(seconds) {
		let remainderSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
		let minutes = Math.floor(seconds / 60);
		return `${minutes}:${remainderSeconds}`;
	}
});
