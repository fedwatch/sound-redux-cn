import * as types from '../constants/ActionTypes';

/**
 * 初始化路由
 * @type {{path: [*], query: {q: string}}}
 */
const initialRoute = {path: ['songs'], query: {q: 'house'}};
/**
 * 初始化状态
 * @type {{route: {path: [*], query: {q: string}}}}
 */
const initialState = {route: initialRoute};

/**
 * 导航
 * @param state
 * @param action
 * @returns {*}
 */
export default function navigator(state = initialState, action) {
    switch (action.type) {
        case types.CHANGE_PATH:
            return Object.assign({}, state, {
                route: action.route,
            });
        default:
            return state;
    }
}
