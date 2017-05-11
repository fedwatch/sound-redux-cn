/**
 * 用户授权认证 操作库
 */
import {arrayOf, normalize} from 'normalizr';
import SC from 'soundcloud';
import Cookies from 'js-cookie';
import {navigateTo} from '../actions/NavigatorActions';
import {changePlayingSong} from '../actions/PlayerActions';
import {fetchSongs, receiveSongs} from '../actions/PlaylistsActions';
import * as types from '../constants/ActionTypes';
import {CLIENT_ID} from '../constants/Config';
import {AUTHED_PLAYLIST_SUFFIX} from '../constants/PlaylistConstants';
import {playlistSchema, songSchema, userSchema} from '../constants/Schemas';

const COOKIE_PATH = 'accessToken';
let streamInterval;

/**
 * 添加新歌曲流到播放列表
 * @returns {function(*, *)}
 */
export function addNewStreamSongsToPlaylist() {
    return (dispatch, getState) => {
        const {authed} = getState();
        dispatch(unshiftNewStreamSongs(authed.newStreamSongs.slice()));
    };
}

/**
 * 添加喜欢
 * @param songId
 * @returns {{type: string, songId: *}}
 */
function appendLike(songId) {
    return {
        type: types.APPEND_LIKE,
        songId,
    };
}

/**
 * 验证用户
 * @param accessToken
 * @param shouldShowStream
 * @returns {function(*): *}
 */
function authUser(accessToken, shouldShowStream = true) {
    return dispatch =>
        dispatch(fetchAuthedUser(accessToken, shouldShowStream));
}

/**
 * 抓取认证用户
 * @param accessToken
 * @param shouldShowStream
 * @returns {function(*): Promise.<TResult>}
 */
function fetchAuthedUser(accessToken, shouldShowStream) {
    return dispatch =>
        fetch(`//api.soundcloud.com/me?oauth_token=${accessToken}`)
            .then(response => response.json())
            .then(json => dispatch(receiveAuthedUserPre(accessToken, json, shouldShowStream)))
            .catch(err => {
                throw err;
            });
}

/**
 * 抓取跟随中数据
 * @param accessToken
 * @returns {function(*): Promise.<TResult>}
 */
function fetchFollowings(accessToken) {
    return dispatch =>
        fetch(`//api.soundcloud.com/me/followings?oauth_token=${accessToken}`)
            .then(response => response.json())
            .then(json => normalize(json.collection, arrayOf(userSchema)))
            .then(normalized => {
                const users = normalized.result
                    .reduce((obj, userId) => Object.assign({}, obj, {[userId]: 1}), {});
                dispatch(receiveAuthedFollowings(users, normalized.entities));
            })
            .catch(err => {
                throw err;
            });
}

/**
 * 抓取喜欢
 * @param accessToken
 * @returns {function(*): Promise.<TResult>}
 */
function fetchLikes(accessToken) {
    return dispatch =>
        fetch(`//api.soundcloud.com/me/favorites?oauth_token=${accessToken}`)
            .then(response => response.json())
            .then(json => {
                const songs = json.filter(song => song.streamable);
                const normalized = normalize(songs, arrayOf(songSchema));
                const likes = normalized.result
                    .reduce((obj, songId) => Object.assign({}, obj, {[songId]: 1}), {});
                dispatch(receiveLikes(likes));
                dispatch(receiveSongs(
                    normalized.entities,
                    normalized.result,
                    `likes${AUTHED_PLAYLIST_SUFFIX}`,
                    null
                ));
            })
            .catch(err => {
                throw err;
            });
}

/**
 * 抓取播放列表
 * @param accessToken
 * @returns {function(*=): Promise.<TResult>}
 */
function fetchPlaylists(accessToken) {
    return dispatch =>
        fetch(`//api.soundcloud.com/me/playlists?oauth_token=${accessToken}`)
            .then(response => response.json())
            .then(json => {
                const normalized = normalize(json, arrayOf(playlistSchema));
                dispatch(receiveAuthedPlaylists(normalized.result, normalized.entities));
                normalized.result.forEach(playlistId => {
                    const playlist = normalized.entities.playlists[playlistId];
                    dispatch(receiveSongs(
                        {},
                        playlist.tracks,
                        playlist.title + AUTHED_PLAYLIST_SUFFIX,
                        null
                    ));
                });
            })
            .catch(err => {
                throw err;
            });
}

/**
 * 抓取新数据流歌曲
 * @param url
 * @param accessToken
 * @returns {function(*, *)}
 */
function fetchNewStreamSongs(url, accessToken) {
    return (dispatch, getState) => {
        const {authed, playlists} = getState();
        const streamSongsMap = playlists[`stream${AUTHED_PLAYLIST_SUFFIX}`].items
            .reduce((obj, songId) => Object.assign({}, obj, {[songId]: 1}), {});
        const newStreamSongsMap = authed.newStreamSongs
            .reduce((obj, songId) => Object.assign({}, obj, {[songId]: 1}), {});

        return fetch(url)
            .then(response => response.json())
            .then(json => {
                const collection = json.collection
                    .map(song => song.origin)
                    .filter(song => song.kind === 'track'
                    && song.streamable
                    && !(song.id in streamSongsMap)
                    && !(song.id in newStreamSongsMap));
                return {futureUrl: `${json.future_href}&oauth_token=${accessToken}`, collection};
            })
            .then(data => {
                const normalized = normalize(data.collection, arrayOf(songSchema));
                dispatch(receiveNewStreamSongs(data.futureUrl, normalized.entities, normalized.result));
            })
            .catch(err => {
                throw err;
            });
    };
}

/**
 * 抓取直播流
 * @param accessToken
 * @returns {function(*)}
 */
function fetchStream(accessToken) {
    return dispatch => {
        dispatch(initInterval(accessToken));
        dispatch(fetchSongs(
            `//api.soundcloud.com/me/activities/tracks/affiliated?limit=50&oauth_token=${accessToken}`,
            `stream${AUTHED_PLAYLIST_SUFFIX}`
        ));
    };
}

/**
 * 初始化验证授权
 * @returns {function(*)}
 */
export function initAuth() {
    return dispatch => {
        const accessToken = Cookies.get(COOKIE_PATH);
        if (accessToken) {
            return dispatch(authUser(accessToken, false));
        }
        return null;
    };
}

/**
 * 初始化定时器
 * @param accessToken
 * @returns {function(*, *)}
 */
function initInterval(accessToken) {
    return (dispatch, getState) => {
        streamInterval = setInterval(() => {
            const playlistKey = `stream${AUTHED_PLAYLIST_SUFFIX}`;
            const {playlists} = getState();
            const streamPlaylist = playlists[playlistKey];

            if (streamPlaylist.futureUrl) {
                dispatch(fetchNewStreamSongs(streamPlaylist.futureUrl, accessToken));
            } else {
                clearInterval(streamInterval);
            }
        }, 60000);
    };
}

/**
 * 登录用户
 * @param shouldShowStream
 * @returns {function(*)}
 */
export function loginUser(shouldShowStream = true) {
    return dispatch => {
        SC.initialize({
            client_id: CLIENT_ID,
            redirect_uri: `${window.location.protocol}//${window.location.host}/api/callback`,
        });

        SC.connect().then(authObj => {
            Cookies.set(COOKIE_PATH, authObj.oauth_token);
            dispatch(authUser(authObj.oauth_token, shouldShowStream));
        })
            .catch(err => {
                throw err;
            });
    };
}

/**
 * 登出用户
 * @returns {function(*, *)}
 */
export function logoutUser() {
    return (dispatch, getState) => {
        Cookies.remove(COOKIE_PATH);
        const {authed, entities, navigator} = getState();
        const {path} = navigator.route;
        const playlists = authed.playlists.map((playlistId) =>
            entities.playlists[playlistId].title + AUTHED_PLAYLIST_SUFFIX
        );

        clearInterval(streamInterval);

        if (path[0] === 'me') {
            dispatch(navigateTo({path: ['songs']}));
        }

        return dispatch(resetAuthed(playlists));
    };
}

/**
 * 接收认证密钥
 * @param accessToken
 * @returns {{type, accessToken: *}}
 */
function receiveAccessToken(accessToken) {
    return {
        type: types.RECEIVE_ACCESS_TOKEN,
        accessToken,
    };
}

/**
 * 接收认证用户
 * @param accessToken
 * @param user
 * @param shouldShowStream
 * @returns {function(*)}
 */
function receiveAuthedUserPre(accessToken, user, shouldShowStream) {
    return dispatch => {
        dispatch(receiveAccessToken(accessToken));
        dispatch(receiveAuthedUser(user));
        dispatch(fetchLikes(accessToken));
        dispatch(fetchPlaylists(accessToken));
        dispatch(fetchStream(accessToken));
        dispatch(fetchFollowings(accessToken));
        if (shouldShowStream) {
            dispatch(navigateTo({path: ['me', 'stream']}));
        }
    };
}

/**
 * 接收认证正在跟随数据
 * @param users
 * @param entities
 * @returns {{type, entities: *, users: *}}
 */
function receiveAuthedFollowings(users, entities) {
    return {
        type: types.RECEIVE_AUTHED_FOLLOWINGS,
        entities,
        users,
    };
}

/**
 * 接收认证后的播放列表数据
 * @param playlists
 * @param entities
 * @returns {{type, entities: *, playlists: *}}
 */
function receiveAuthedPlaylists(playlists, entities) {
    return {
        type: types.RECEIVE_AUTHED_PLAYLISTS,
        entities,
        playlists,
    };
}

/**
 * 接收认证后用户数据
 * @param user
 * @returns {{type, user: *}}
 */
function receiveAuthedUser(user) {
    return {
        type: types.RECEIVE_AUTHED_USER,
        user,
    };
}

/**
 * 接收喜欢
 * @param likes
 * @returns {{type, likes: *}}
 */
function receiveLikes(likes) {
    return {
        type: types.RECEIVE_LIKES,
        likes,
    };
}

/**
 * 接收新数据流歌曲
 * @param futureUrl
 * @param entities
 * @param songs
 * @returns {{type, entities: *, futureUrl: *, songs: *}}
 */
function receiveNewStreamSongs(futureUrl, entities, songs) {
    return {
        type: types.RECEIVE_NEW_STREAM_SONGS,
        entities,
        futureUrl,
        songs,
    };
}

/**
 * 重置认证
 * @param playlists
 * @returns {{type, playlists: *}}
 */
function resetAuthed(playlists) {
    return {
        type: types.RESET_AUTHED,
        playlists,
    };
}

/**
 * 设置正在跟随数据
 * @param userId
 * @param following
 * @returns {{type, following: *, userId: *}}
 */
function setFollowing(userId, following) {
    return {
        type: types.SET_FOLLOWING,
        following,
        userId,
    };
}

/**
 * 设置喜欢
 * @param songId
 * @param liked
 * @returns {{type, liked: *, songId: *}}
 */
function setLike(songId, liked) {
    return {
        type: types.SET_LIKE,
        liked,
        songId,
    };
}


/**
 * 同步正在跟随的数据
 * @param accessToken
 * @param userId
 * @param following
 */
function syncFollowing(accessToken, userId, following) {
    fetch(
        `//api.soundcloud.com/me/followings/${userId}?oauth_token=${accessToken}`,
        {method: following ? 'put' : 'delete'}
    );
}

/**
 * 同步喜欢数据
 * @param accessToken
 * @param songId
 * @param liked
 */
function syncLike(accessToken, songId, liked) {
    fetch(
        `//api.soundcloud.com/me/favorites/${songId}?oauth_token=${accessToken}`,
        {method: liked ? 'put' : 'delete'}
    );
}

/**
 * 切换跟随状态
 * @param userId
 * @returns {function(*, *)}
 */
export function toggleFollow(userId) {
    return (dispatch, getState) => {
        const {authed} = getState();
        const {followings} = authed;
        const following = userId in followings && followings[userId] === 1 ? 0 : 1;
        dispatch(setFollowing(userId, following));
        syncFollowing(authed.accessToken, userId, following);
    };
}

/**
 * 切换喜欢状态
 * @param songId
 * @returns {function(*, *)}
 */
export function toggleLike(songId) {
    return (dispatch, getState) => {
        const {authed, player} = getState();
        const {likes} = authed;
        const {selectedPlaylists, currentSongIndex} = player;
        const liked = songId in likes && likes[songId] === 1 ? 0 : 1;
        if (!(songId in likes)) {
            dispatch(appendLike(songId));
            if (currentSongIndex !== null
                && selectedPlaylists[selectedPlaylists.length - 1] === `likes${AUTHED_PLAYLIST_SUFFIX}`) {
                dispatch(changePlayingSong(currentSongIndex + 1));
            }
        }

        dispatch(setLike(songId, liked));
        syncLike(authed.accessToken, songId, liked);
    };
}

/**
 * 换掉新歌曲流
 * @param songs
 * @returns {{type, songs: *}}
 */
function unshiftNewStreamSongs(songs) {
    return {
        type: types.UNSHIFT_NEW_STREAM_SONGS,
        songs,
    };
}
