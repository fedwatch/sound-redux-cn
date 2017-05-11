/**
 * 导航 操作库
 */
import * as types from '../constants/ActionTypes';
import {constructUrl, parseUrl} from '../utils/RouteUtils';

/**
 * 更改路径
 * @param route
 * @returns {{type, route: *}}
 */
export function changePath(route) {
    return {
        type: types.CHANGE_PATH,
        route,
    };
}

/**
 * 初始化导航
 * @returns {function(*)}
 */
export function initNavigator() {
    return dispatch => {
        window.onpopstate = e => {
            dispatch(navigateBack(e));
        };

        if (window.location.hash !== '') {
            dispatch(navigateTo(parseUrl(window.location.hash)));
        }
    };
}

/**
 * 导航返回
 * @param e
 * @returns {function(*)}
 */
export function navigateBack(e) {
    return dispatch => {
        if (e.state) {
            return dispatch(navigateTo(e.state.route, false));
        }
        return null;
    };
}

/**
 * 导航跳到
 * @param route
 * @param shouldPushState
 * @returns {function(*, *)}
 */
export function navigateTo(route, shouldPushState = true) {
    return (dispatch, getState) => {
        const {navigator} = getState();
        if (constructUrl(route) === constructUrl(navigator.route)) {
            return null;
        }

        if (shouldPushState) {
            pushState(route);
        }

        return dispatch(changePath(route));
    };
}

/**
 * 推送路由状态
 * @param route
 */
function pushState(route) {
    history.pushState({route}, '', `#/${constructUrl(route)}`);
}
