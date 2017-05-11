import React, {Component, PropTypes} from 'react';

/**
 * 属性验证
 * @type {{isOn: *, toggleFunc: *}}
 */
const propTypes = {
    isOn: PropTypes.bool.isRequired,
    toggleFunc: PropTypes.func.isRequired,
};


/**
 * 切换栏
 */
class Switch extends Component {
    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        const {isOn, toggleFunc} = this.props;

        return (
            <div
                className={`switch ${(isOn ? 'on' : '')}`}
                onClick={toggleFunc}
            >
                <div className="switch-button"/>
            </div>
        );
    }
}

Switch.propTypes = propTypes;

export default Switch;
