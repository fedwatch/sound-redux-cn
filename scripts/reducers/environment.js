import * as types from '../constants/ActionTypes';
/**
 * 初始化状态
 * @type {{isMobile: boolean, height: null, width: null}}
 */
const initialState = {
    isMobile: false,
    height: null,
    width: null,
};

/**
 * 环境检测
 * @param state
 * @param action
 * @returns {*}
 */
export default function environment(state = initialState, action) {
    switch (action.type) {
        case types.CHANGE_IS_MOBILE:
            return Object.assign({}, state, {
                isMobile: action.isMobile,
            });

        case types.CHANGE_WIDTH_AND_HEIGHT:
            return Object.assign({}, state, {
                height: action.height,
                width: action.width,
            });

        default:
            return state;
    }
}
