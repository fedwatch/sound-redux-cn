/**
 * 播放列表 操作库
 */
import {arrayOf, normalize} from 'normalizr';
import {changePlayingSong} from '../actions/PlayerActions';
import * as types from '../constants/ActionTypes';
import {AUTHED_PLAYLIST_SUFFIX} from '../constants/PlaylistConstants';
import {songSchema} from '../constants/Schemas';
import {GENRES_MAP} from '../constants/SongConstants';

import {getPlayingPlaylist} from '../utils/PlayerUtils';
import {constructUrl} from '../utils/SongUtils';

/**
 * 抓取歌曲库
 * @param url
 * @param playlist
 * @returns {function(*, *)}
 */
export function fetchSongs(url, playlist) {
    return (dispatch, getState) => {
        const {authed} = getState();
        dispatch(requestSongs(playlist));

        return fetch(url)
            .then(response => response.json())
            .then(json => {
                let nextUrl = null;
                let futureUrl = null;
                if (json.next_href) {
                    nextUrl = json.next_href;
                    nextUrl += (authed.accessToken ? `&oauth_token=${authed.accessToken}` : '');
                }

                if (json.future_href) {
                    futureUrl = json.future_href;
                    futureUrl += (authed.accessToken ? `&oauth_token=${authed.accessToken}` : '');
                }

                const songs = json.collection
                    .map(song => song.origin || song)
                    .filter(song => {
                        if (playlist in GENRES_MAP) {
                            return song.streamable && song.kind === 'track' && song.duration < 600000;
                        }

                        return song.streamable && song.kind === 'track';
                    });

                const normalized = normalize(songs, arrayOf(songSchema));
                const result = normalized.result.reduce((arr, songId) => {
                    if (arr.indexOf(songId) === -1) {
                        arr.push(songId);
                    }

                    return arr;
                }, []);

                dispatch(receiveSongs(normalized.entities, result, playlist, nextUrl, futureUrl));
            })
            .catch(err => {
                throw err;
            });
    };
}

/**
 * 需要时抓取歌曲
 * @param playlist
 * @returns {function(*, *)}
 */
export function fetchSongsIfNeeded(playlist) {
    return (dispatch, getState) => {
        const {playlists} = getState();
        if (shouldFetchSongs(playlists, playlist)) {
            const nextUrl = getNextUrl(playlists, playlist);
            return dispatch(fetchSongs(nextUrl, playlist));
        }

        return null;
    };
}

/**
 * 获得下一首歌曲URL
 * @param playlists
 * @param playlist
 * @returns {*}
 */
function getNextUrl(playlists, playlist) {
    const activePlaylist = playlists[playlist];
    if (!activePlaylist || activePlaylist.nextUrl === false) {
        return constructUrl(playlist);
    }

    return activePlaylist.nextUrl;
}

/**
 * 接收歌曲
 * @param entities
 * @param songs
 * @param playlist
 * @param nextUrl
 * @param futureUrl
 * @returns {{type, entities: *, futureUrl: *, nextUrl: *, playlist: *, songs: *}}
 */
export function receiveSongs(entities, songs, playlist, nextUrl, futureUrl) {
    return {
        type: types.RECEIVE_SONGS,
        entities,
        futureUrl,
        nextUrl,
        playlist,
        songs,
    };
}

/**
 * 删除不喜欢的歌曲
 * @returns {function(*, *)}
 */
export function removeUnlikedSongsPre() {
    return (dispatch, getState) => {
        const LIKES_PLAYLIST_KEY = `likes${AUTHED_PLAYLIST_SUFFIX}`;
        const {authed, player, playlists} = getState();
        const {currentSongIndex} = player;
        const playingPlaylist = getPlayingPlaylist(player);

        const likedSongs = playlists[LIKES_PLAYLIST_KEY].items
            .filter(songId => songId in authed.likes && authed.likes[songId] === 1);

        if (playingPlaylist === LIKES_PLAYLIST_KEY
            && currentSongIndex >= likedSongs.length) {
            dispatch(changePlayingSong(null));
        }

        dispatch(removeUnlikedSongs(likedSongs));
    };
}

/**
 * 删除不喜欢的歌曲
 * @param songs
 * @returns {{type, songs: *}}
 */
function removeUnlikedSongs(songs) {
    return {
        type: types.REMOVE_UNLIKED_SONGS,
        songs,
    };
}

/**
 * 请求歌曲数据
 * @param playlist
 * @returns {{type, playlist: *}}
 */
function requestSongs(playlist) {
    return {
        type: types.REQUEST_SONGS,
        playlist,
    };
}

/**
 * 是否抓取歌曲
 * @param playlists
 * @param playlist
 * @returns {boolean}
 */
function shouldFetchSongs(playlists, playlist) {
    const activePlaylist = playlists[playlist];
    if (!activePlaylist || !activePlaylist.isFetching && (activePlaylist.nextUrl !== null)) {
        return true;
    }

    return false;
}
