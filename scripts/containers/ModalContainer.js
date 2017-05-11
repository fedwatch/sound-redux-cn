import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import Modal from '../components/Modal';

/**
 * 属性验证
 * @type {{modal}}
 */
const propTypes = {
    modal: PropTypes.string,
};

/**
 * 模态框容器
 */
class ModalContainer extends Component {
    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        if (!this.props.modal) {
            return <div />;
        }

        return <Modal {...this.props} />;
    }
}

ModalContainer.propTypes = propTypes;

/**
 * 映射状态到属性
 * @param state
 * @returns {{modal: *}}
 */
function mapStateToProps(state) {
    const {modal} = state;
    return {modal};
}

export default connect(mapStateToProps)(ModalContainer);
