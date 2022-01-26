const {importUtil, XElement} = require('xx-element');
const {template, name} = importUtil(__filename);
const Storage = require('../../services/storage');

customElements.define(name, class extends XElement {
	#playlistListStorage;

	static get attributeTypes() {
		return {
			playlistList: {type: XElement.PropertyTypes.object},
		};
	}

	static get htmlTemplate() {
		return template;
	}

	connectedCallback() {
	}

	set playlistList(playlistList) {
		this.#playlistListStorage = new Storage('playlist-ids'); // todo pass in

		this.$('#add').addEventListener('click', () => {
			// todo use playlistList.on('add', playlist => {
			// todo don't manipulate playlistList directly
			let playlist = playlistList.add(this.$('#id').value);
			if (playlist) {
				this.#playlistListStorage.write(
					playlistList.playlists.map(playlist => playlist.id));
				this.addLine(playlist);
			}
		});

		let storedIds = this.#playlistListStorage.read();
		if (!Array.isArray(storedIds))
			storedIds = [];
		storedIds.forEach(id => {
			let playlist = playlistList.add(id);
			if (playlist)
				this.addLine(playlist);
			else
				console.warn('Unexpected duplicate stored playlist ID.');
		});
	}

	async addLine(playlist) {
		if (this.$('#id').value === playlist.id)
			this.$('#id').value = '';

		let line = this.#findLine(playlist.id);
		if (!line) {
			line = document.createElement('x-playlist-list-line');
			line.id = playlist.id;
			line.addEventListener('remove', () => {
				// todo use playlistList.on('remove', playlist => {
				if (this.playlistList.remove(playlist.id)) {
					this.#playlistListStorage.write(this.playlistList.playlists);
					line.remove();
				}
			});
			this.$('#lines').appendChild(line);
		}
		line.title = await playlist.title;
		line.length = await playlist.length;
		await playlist.hadError;
		line.error = true;
	}

	#findLine(id) {
		return [...this.$('#lines').children].find(line => line.id === id);
	}
});
