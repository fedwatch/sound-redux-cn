import * as types from '../constants/ActionTypes';

/**
 * 初始化状态
 * @type {{accessToken: null, followings: {}, likes: {}, newStreamSongs: Array, playlists: Array, user: null}}
 */
const initialState = {
    accessToken: null,
    followings: {},
    likes: {},
    newStreamSongs: [],
    playlists: [],
    user: null,
};
/**
 * 认证授权
 * @param state
 * @param action
 * @returns {*}
 */
export default function authed(state = initialState, action) {
    switch (action.type) {
        case types.RECEIVE_ACCESS_TOKEN://接收到认证密钥
            return Object.assign({}, state, {
                accessToken: action.accessToken,
            });

        case types.RECEIVE_AUTHED_USER://接收到认证用户
            return Object.assign({}, state, {
                user: action.user,
            });

        case types.RECEIVE_AUTHED_FOLLOWINGS://接收到认证粉丝
            return Object.assign({}, state, {
                followings: action.users,
            });

        case types.RECEIVE_AUTHED_PLAYLISTS://接收到认证音乐列表
            return Object.assign({}, state, {
                playlists: action.playlists,
            });

        case types.RECEIVE_LIKES://接收到喜欢
            return Object.assign({}, state, {
                likes: action.likes,
            });

        case types.RECEIVE_NEW_STREAM_SONGS://接收到新媒体音乐
            return Object.assign({}, state, {
                newStreamSongs: [...action.songs, ...state.newStreamSongs],
            });

        case types.RESET_AUTHED://重新认证
            return Object.assign({}, initialState);

        case types.SET_FOLLOWING://设置跟随状态
            return Object.assign({}, state, {
                followings: Object.assign({}, state.followings, {
                    [action.userId]: action.following,
                }),
            });

        case types.SET_LIKE://设置喜欢状态
            return Object.assign({}, state, {
                likes: Object.assign({}, state.likes, {
                    [action.songId]: action.liked,
                }),
            });

        case types.UNSHIFT_NEW_STREAM_SONGS://取关新媒体音乐
            return Object.assign({}, state, {
                newStreamSongs: [],
            });

        default:
            return state;
    }
}
