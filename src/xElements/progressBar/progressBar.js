const {importUtil, XElement} = require('xx-element');
const {template, name} = importUtil(__filename);

customElements.define(name, class extends XElement {
	static get attributeTypes() {
		return {
			preValue: {type: XElement.PropertyTypes.string},
			postValue: {type: XElement.PropertyTypes.string},
			progress: {type: XElement.PropertyTypes.number},
		};
	}

	static get htmlTemplate() {
		return template;
	}

	connectedCallback() {
		this.addEventListener('click', ({offsetX}) =>
			this.emit('progress-set', offsetX / this.clientWidth));
	}

	set preValue(preValue) {
		this.$(`#pre-value`).textContent = preValue;
	}

	set postValue(postValue) {
		this.$(`#post-value`).textContent = postValue;
	}

	set progress(progress) {
		this.$('#fill').style.width = progress * 100 + '%';
	}
});
