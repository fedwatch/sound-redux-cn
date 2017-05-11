/**
 * 模态框 操作库
 */
import * as types from '../constants/ActionTypes';

/**
 * 更改模态框
 * @param modal
 * @returns {{type, modal: *}}
 */
export function changeModal(modal) {
    return {
        type: types.CHANGE_MODAL,
        modal,
    };
}
