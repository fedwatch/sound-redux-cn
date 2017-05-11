/**
 * 歌曲 操作库
 */
import {arrayOf, normalize} from 'normalizr';
import {receiveSongs} from '../actions/PlaylistsActions';
import * as types from '../constants/ActionTypes';
import {SONG_PLAYLIST_SUFFIX} from '../constants/PlaylistConstants';
import {songSchema} from '../constants/Schemas';
import {
    constructSongUrl,
    constructSongCommentsUrl,
    constructUserSongsUrl,
} from '../utils/SongUtils';

/**
 * 抓取类似的歌曲
 * @param userId
 * @param songTitle
 * @returns {function(*): Promise.<TResult>}
 */
function fetchRelatedSongs(userId, songTitle) {
    return dispatch =>
        fetch(constructUserSongsUrl(userId))
            .then(response => response.json())
            .then(json => {
                const songs = json.filter(song => songTitle !== song.title);
                const normalized = normalize(songs, arrayOf(songSchema));
                dispatch(receiveSongs(
                    normalized.entities,
                    normalized.result,
                    songTitle + SONG_PLAYLIST_SUFFIX,
                    null
                ));
            })
            .catch(err => {
                throw err;
            });
}

/**
 * 需要时抓取歌曲数据
 * @param songId
 * @returns {function(*, *)}
 */
export function fetchSongIfNeeded(songId) {
    return (dispatch, getState) => {
        const {entities, playlists} = getState();
        const {songs} = entities;
        if (!(songId in songs) || songs[songId].waveform_url.indexOf('json') > -1) {
            dispatch(fetchSong(songId));
        } else {
            const song = songs[songId];
            const songPlaylistKey = song.title + SONG_PLAYLIST_SUFFIX;
            if (!(songPlaylistKey in playlists)) {
                dispatch(receiveSongs({}, [songId], songPlaylistKey, null));
            }

            if (!('comments' in songs[songId])) {
                dispatch(fetchSongData(songId, song.user_id, song.title));
            }
        }
    };
}

/**
 * 抓取歌曲
 * @param songId
 * @returns {function(*)}
 */
function fetchSong(songId) {
    return dispatch => {
        dispatch(requestSong(songId));
        return fetch(constructSongUrl(songId))
            .then(response => response.json())
            .then(json => {
                const normalized = normalize(json, songSchema);
                dispatch(receiveSongPre(songId, normalized.entities));
            })
            .catch(err => {
                throw err;
            });
    };
}

/**
 * 抓取歌曲评论
 * @param songId
 * @returns {function(*): Promise.<TResult>}
 */
function fetchSongComments(songId) {
    return dispatch =>
        fetch(constructSongCommentsUrl(songId))
            .then(response => response.json())
            .then(json => dispatch(receiveSongComments(songId, json)))
            .catch(err => {
                throw err;
            });
}

/**
 * 抓取歌曲数据
 * @param songId
 * @param userId
 * @param songTitle
 * @returns {function(*)}
 */
function fetchSongData(songId, userId, songTitle) {
    return dispatch => {
        dispatch(fetchRelatedSongs(userId, songTitle));
        dispatch(fetchSongComments(songId));
    };
}

/**
 * 接收歌曲
 * @param entities
 * @returns {{type, entities: *}}
 */
export function receiveSong(entities) {
    return {
        type: types.RECEIVE_SONG,
        entities,
    };
}

/**
 * 接收歌曲评论
 * @param songId
 * @param comments
 * @returns {{type, entities: {songs: {}}}}
 */
function receiveSongComments(songId, comments) {
    return {
        type: types.RECEIVE_SONG_COMMENTS,
        entities: {
            songs: {
                [songId]: {
                    comments,
                },
            },
        },
    };
}

/**
 * 接收歌曲
 * @param songId
 * @param entities
 * @returns {function(*)}
 */
function receiveSongPre(songId, entities) {
    return dispatch => {
        const songTitle = entities.songs[songId].title;
        const userId = entities.songs[songId].user_id;
        dispatch(receiveSong(entities));
        dispatch(receiveSongs(entities, [songId], songTitle + SONG_PLAYLIST_SUFFIX, null));
        dispatch(fetchSongData(songId, userId, songTitle));
    };
}

/**
 * 请求歌曲
 * @param songId
 * @returns {{type, songId: *}}
 */
function requestSong(songId) {
    return {
        type: types.REQUEST_SONG,
        songId,
    };
}
