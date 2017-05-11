import merge from 'lodash/merge';

/**
 * 初始化状态
 * @type {{playlists: {}, songs: {}, users: {}}}
 */
const initialState = {
    playlists: {},
    songs: {},
    users: {},
};

/**
 * 合并实体化
 * @param state
 * @param action
 * @returns {{playlists: {}, songs: {}, users: {}}}
 */
export default function entities(state = initialState, action) {
    if (action.entities) {
        return merge({}, state, action.entities);
    }

    return state;
}
