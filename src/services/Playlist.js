const Stream = require('bs-better-stream');
const Video = require('./Video');
const youtube = require('./youtube');
const PromiseW = require('./utils/PromiseW');

class Playlist {
	#id;
	#videos;
	#hadError;

	#overviewCache;
	#pageCache;

	constructor(id) {
		this.#id = id;
		this.#pageCache = {};
		this.#videos = this.#initVideos();
		this.#hadError = new PromiseW();
	}

	get id() {
		return this.#id;
	}

	get videos() {
		return this.#videos;
	}

	#initVideos() {
		let pages = new Stream();
		let responses = pages
			.map(page => this.#getPage(page))
			.each(responsePromise => responsePromise.catch(() => this.#hadError.resolve()))
			.wait(true);
		responses
			.pluck('nextPageToken')
			.filter(nextPage => nextPage)
			.to(pages);
		pages.write('');
		return responses
			.pluck('items')
			.flatten()
			.pluck('snippet')
			.map(({resourceId: {videoId}, title, thumbnails}) =>
				({videoId, title, thumbnail: thumbnails?.default?.url}))
			.uniqueOn('videoId')
			.map(({videoId, title}) => new Video(videoId, title));
	}

	get title() {
		return this.#getOverview().then(overview => overview.items[0]?.snippet.title || '');
	}

	get length() {
		return this.#getOverview().then(overview => overview.items[0]?.contentDetails.itemCount || 0);
	}

	#getOverview() {
		return this.#overviewCache = this.#overviewCache || youtube.getPlaylistOverview(this.#id);
	}

	#getPage(page = '') {
		return this.#pageCache[page] = this.#pageCache[page] || youtube.getPlaylistPage(this.#id, page);
	}

	get hadError() {
		return this.#hadError;
	}
}

module.exports = Playlist;
