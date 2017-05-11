import React, {Component} from 'react';

/**
 * 登录模态框
 */
class ModalLogin extends Component {
    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        const onClickFunc = e => {
            e.stopPropagation();
        };
        return (
            <div className="modal-content" onClick={onClickFunc}>
                <div className="modal-header">Sign into to your Soundcloud Account</div>
                <div className="modal-body"></div>
                <div className="modal-footer"></div>
            </div>
        );
    }
}

export default ModalLogin;
