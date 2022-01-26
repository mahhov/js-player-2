const EventEmitter = require('events');
const Playlist = require('../../services/Playlist');

class PlaylistListModel extends EventEmitter {
	#playlists;

	constructor() {
		super();
		this.#playlists = [];
	}

	get playlists() {
		return this.#playlists;
	}

	add(id) {
		if (id && !this.#playlists.some(playlist => playlist.id === id)) {
			let playlist = new Playlist(id);
			this.#playlists.push(playlist);
			this.emit('add', playlist);
			return playlist;
		}
	}

	remove(id) {
		let index = this.#playlists.findIndex(v => v.id === id);
		if (index !== -1) {
			this.#playlists.splice(index, 1);
			this.emit('remove', this.#playlists[index]);
			return true;
		}
	}
}

module.exports = PlaylistListModel;
