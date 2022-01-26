const {importUtil, XElement} = require('xx-element');
const {template, name} = importUtil(__filename);
const Visualizer = require('../../services/Visualizer');

const BAR_COUNT = 32 * 4;

customElements.define(name, class extends XElement {
	#docFocus;

	#visualizer;
	#animationFramePending;

	static get attributeTypes() {
		return {
			analyzer: {type: XElement.PropertyTypes.object},
			width: {type: XElement.PropertyTypes.string},
			height: {type: XElement.PropertyTypes.string},
		};
	}

	static get htmlTemplate() {
		return template;
	}

	connectedCallback() {
		this.#docFocus = true;
		window.addEventListener('blur', () => this.#docFocus = false);
		window.addEventListener('focus', () => {
			this.#docFocus = true;
			this.#updateVisualizer();
		});

		if (!this.hasAttribute('width'))
			this.setAttribute('width', '1000');
		if (!this.hasAttribute('height'))
			this.setAttribute('height', '200');
		this.#newVisualizer();
	}

	set analyzer(analyzer) {
		this.#updateVisualizer();
	}

	set width(width) {
		this.$('#canvas').width = width;
		this.#newVisualizer();
	}

	set height(height) {
		this.$('#canvas').height = height;
		this.#newVisualizer();
	}

	#updateVisualizer() {
		if (this.#animationFramePending || !this.#docFocus)
			return;

		this.frequencyData_ = this.frequencyData_ || new Uint8Array(BAR_COUNT);
		if (!this.analyzer || !this.#visualizer)
			return;
		this.analyzer.getByteFrequencyData(this.frequencyData_);
		this.#visualizer.draw([...this.frequencyData_].map(v => v / 255));

		this.#animationFramePending = requestAnimationFrame(() => {
			this.#animationFramePending = 0;
			this.#updateVisualizer();
		});
	}

	#newVisualizer() {
		let canvas = this.$('#canvas');
		let canvasCtx = canvas.getContext('2d');
		this.#visualizer = new Visualizer(canvas.width, canvas.height, canvasCtx, BAR_COUNT);
		this.#updateVisualizer();
		// todo update Visualizer so that we can update it's dimensions without creating a brand new visualizer
	}
});
