const {importUtil, XElement} = require('xx-element');
const {template, name} = importUtil(__filename);
const {shell} = require('electron');

customElements.define(name, class extends XElement {
	static get attributeTypes() {
		return {
			id: {type: XElement.PropertyTypes.string},
			title: {type: XElement.PropertyTypes.string},
			downloadStatus: {type: XElement.PropertyTypes.string}, // none, downloading, failed, success
		};
	}

	static get htmlTemplate() {
		return template;
	}

	connectedCallback() {
		this.$('#open').addEventListener('click', e => {
			e.stopPropagation(); // prevent selecting
			shell.openExternal(`https://www.youtube.com/watch?v=${this.id}`);
		});
	}

	set title(title) {
		this.$('#title').textContent = title;
	}

	set downloadStatus(downloadStatus) {
		this.$('#download-status').textContent = downloadStatus;
	}
});
