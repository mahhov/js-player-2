const {importUtil, XElement} = require('xx-element');
const {template, name} = importUtil(__filename);

customElements.define(name, class extends XElement {
	static get attributeTypes() {
		return {
			id: {type: XElement.PropertyTypes.string},
			title: {type: XElement.PropertyTypes.string},
			length: {type: XElement.PropertyTypes.number},
			error: {type: XElement.PropertyTypes.boolean},
			// todo download status
		};
	}

	static get htmlTemplate() {
		return template;
	}

	connectedCallback() {
		this.bubble(this.$('#remove'), 'click', 'remove');
	}

	set id(id) {
		this.$('#title').textContent = this.title || id;
	}

	set title(title) {
		this.$('#title').textContent = title || this.id;
	}

	set length(length) {
		this.$('#length').textContent = length;
	}

	set error(error) {
		this.$('#error').classList.toggle('visible', error);
	}
});
