import React, {Component, PropTypes} from 'react';
import {changeModal} from '../actions/ModalActions';
import ModalLogin from '../components/ModalLogin';

/**
 * 属性验证
 * @type {{dispatch: *, modal: *}}
 */
const propTypes = {
    dispatch: PropTypes.func.isRequired,
    modal: PropTypes.string.isRequired,
};

/**
 * 模态框
 */
class Modal extends Component {
    /**
     * 构造器
     * @param props
     */
    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
    }

    /**
     * 关闭模态框
     */
    closeModal() {
        const {dispatch} = this.props;
        dispatch(changeModal(null));
    }

    /**
     * 渲染内容
     * @returns {XML}
     */
    renderContent() {
        const {modal} = this.props;
        switch (modal) {
            case 'login':
                return <ModalLogin />;
            default:
                return <div></div>;
        }
    }

    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        return (
            <div className="modal" onClick={this.closeModal}>
                {this.renderContent()}
            </div>
        );
    }
}

Modal.propTypes = propTypes;

export default Modal;
