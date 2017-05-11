/**
 * 环境设备检测 操作库
 */
import * as types from '../constants/ActionTypes';

/**
 * 更改是否是移动设备
 * @param isMobile
 * @returns {{type, isMobile: *}}
 */
function changeIsMobile(isMobile) {
    return {
        type: types.CHANGE_IS_MOBILE,
        isMobile,
    };
}

/**
 * 更改高度与宽度
 * @param height
 * @param width
 * @returns {{type, height: *, width: *}}
 */
export function changeWidthAndHeight(height, width) {
    return {
        type: types.CHANGE_WIDTH_AND_HEIGHT,
        height,
        width,
    };
}

/**
 * 初始化环境设备检测
 * @returns {function(*)}
 */
export function initEnvironment() {
    return dispatch => {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
            .test(navigator.userAgent);
        if (isMobile) {
            document.body.style.overflow = 'hidden';
        }

        dispatch(changeIsMobile(isMobile));
        dispatch(changeWidthAndHeight(window.innerHeight, window.innerWidth));

        window.onresize = () => {
            dispatch(changeWidthAndHeight(window.innerHeight, window.innerWidth));
        };
    };
}
