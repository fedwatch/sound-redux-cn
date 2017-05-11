/**
 * 用户构造动作
 */
import {arrayOf, normalize} from 'normalizr';
import merge from 'lodash/merge';
import {receiveSongs} from '../actions/PlaylistsActions';
import * as types from '../constants/ActionTypes';
import {USER_PLAYLIST_SUFFIX} from '../constants/PlaylistConstants';
import {songSchema, userSchema} from '../constants/Schemas';

import {
    constructUserFollowingsUrl,
    constructUserTracksUrl,
    constructUserUrl,
    constructUserProfilesUrl,
} from '../utils/UserUtils';

/**
 * 抓取用户数据
 * @param userId
 * @param username
 * @returns {function(*)}
 */
function fetchUserData(userId, username) {
    return dispatch => {
        dispatch(fetchUserTracks(userId, username));
        dispatch(fetchUserFollowings(userId));
        dispatch(fetchUserProfiles(userId));
    };
}

/**
 * 抓取用户如果你需要
 * @param userId
 * @returns {function(*, *)}
 */
export function fetchUserIfNeeded(userId) {
    return (dispatch, getState) => {
        const {entities} = getState();
        const {users} = entities;
        if (!(userId in users) || !users[userId].description) {
            return dispatch(fetchUser(userId));
        } else if (!('followings' in users[userId])) {
            return dispatch(fetchUserData(userId, users[userId].username));
        }

        return null;
    };
}

/**
 * 抓取用户
 * @param userId
 * @returns {function(*)}
 */
function fetchUser(userId) {
    return dispatch => {
        dispatch(requestUser(userId));
        return fetch(constructUserUrl(userId))
            .then(response => response.json())
            .then(json => {
                const normalized = normalize(json, userSchema);
                dispatch(receiveUserPre(userId, normalized.entities));
            })
            .catch(err => {
                throw err;
            });
    };
}

/**
 * 抓取用户跟随
 * @param userId
 * @returns {function(*): Promise.<TResult>}
 */
function fetchUserFollowings(userId) {
    return dispatch =>
        fetch(constructUserFollowingsUrl(userId))
            .then(response => response.json())
            .then(json => {
                const users = json.collection.sort((a, b) => b.followers_count - a.followers_count);
                const normalized = normalize(users, arrayOf(userSchema));
                const entities = merge({}, normalized.entities, {
                    users: {
                        [userId]: {followings: normalized.result},
                    },
                });

                dispatch(receiveUserFollowings(entities));
            })
            .catch(err => {
                throw err;
            });
}

/**
 * 抓取用户介绍
 * @param userId
 * @returns {function(*): Promise.<TResult>}
 */
function fetchUserProfiles(userId) {
    return dispatch =>
        fetch(constructUserProfilesUrl(userId))
            .then(response => response.json())
            .then(json => {
                const entities = {users: {[userId]: {profiles: json}}};
                dispatch(receiveUserProfiles(entities));
            })
            .catch(err => {
                throw err;
            });
}

/**
 * 抓取用户轨道
 * @param userId
 * @param username
 * @returns {function(*): Promise.<TResult>}
 */
function fetchUserTracks(userId, username) {
    return dispatch =>
        fetch(constructUserTracksUrl(userId))
            .then(response => response.json())
            .then(json => {
                const normalized = normalize(json, arrayOf(songSchema));
                dispatch(receiveSongs(
                    normalized.entities,
                    normalized.result,
                    username + USER_PLAYLIST_SUFFIX, null
                ));
            })
            .catch(err => {
                throw err;
            });
}

/**
 * 接收用户正在跟随数
 * @param entities
 * @returns {{type, entities: *}}
 */
export function receiveUserFollowings(entities) {
    return {
        type: types.RECEIVE_USER_FOLLOWINGS,
        entities,
    };
}

/**
 * 接收用户
 * @param userId
 * @param entities
 * @returns {function(*)}
 */
function receiveUserPre(userId, entities) {
    return dispatch => {
        dispatch(receiveUser(entities));
        dispatch(fetchUserData(userId, entities.users[userId].username));
    };
}

/**
 * 接收用户
 * @param entities
 * @returns {{type, entities: *}}
 */
export function receiveUser(entities) {
    return {
        type: types.RECEIVE_USER,
        entities,
    };
}

/**
 * 接收用户介绍
 * @param entities
 * @returns {{type, entities: *}}
 */
export function receiveUserProfiles(entities) {
    return {
        type: types.RECEIVE_USER_PROFILES,
        entities,
    };
}

/**
 * 请求用户
 * @param userId
 * @returns {{type, userId: *}}
 */
export function requestUser(userId) {
    return {
        type: types.REQUEST_USER,
        userId,
    };
}
