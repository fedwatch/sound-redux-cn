import * as types from '../constants/ActionTypes';

/**
 * 模态窗口
 * @param state
 * @param action
 * @returns {*}
 */
export default function modal(state = null, action) {
    switch (action.type) {
        case types.CHANGE_MODAL:
            return action.modal;
        default:
            return state;
    }
}
