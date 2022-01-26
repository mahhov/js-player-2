const axios = require('axios');
const API_ENDPOINT = 'https://www.googleapis.com/youtube/v3';

// todo sort out keys
// let apiKey = 'AIzaSyAdkXuGc2f7xJg5FLTWBi2cRUhzAJD-eC0';
const apiKey = 'AIzaSyBEIQjA_wQnhHC68hovfbhMGdbT0qewdVE';
// const apiKey = 'AIzaSyCgXdZVVVsh7FVKb5wicN5Bv2tiPD22U60';

const setApiKey = value => apiKey = value;

const get = async (path, queryParamsObj) =>
    (await axios.get(`${API_ENDPOINT}/${path}?${queryParams(queryParamsObj)}`)).data;

const queryParams = (params = {}) =>
    Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&');

const getPlaylistOverview = playlistId =>
    get('playlists', {part: 'snippet,contentDetails', id: playlistId, key: apiKey});

const getPlaylistPage = (playlistId, pageToken) =>
    get('playlistItems', {part: 'snippet', maxResults: 50, pageToken, playlistId, key: apiKey});

const getSearch = (query, maxResults) =>
    get('search', {part: 'snippet', maxResults, type: 'video', q: query, key: apiKey});

const getSearchRelated = (relatedToVideoId, maxResults) =>
    get('search', {part: 'snippet', maxResults, type: 'video', relatedToVideoId, key: apiKey});

const getVideosTitles = ids =>
    get('videos', {part: 'snippet', id: ids.join(','), key: apiKey});

module.exports = {setApiKey, getPlaylistOverview, getPlaylistPage, getSearch, getSearchRelated, getVideosTitles};
