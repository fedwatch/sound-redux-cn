import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';

/**
 * 属性验证
 * @type {{className, children: *}}
 */
const propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
};

/**
 * 弹出框
 */
class Popover extends Component {
    /**
     * 构造器
     * @param props
     */
    constructor(props) {
        super(props);
        if (props.children.length !== 2) {
            throw new Error('Popover component requires exactly 2 children');
        }

        this.onOutsideClick = this.onOutsideClick.bind(this);
        this.toggleIsOpen = this.toggleIsOpen.bind(this);

        this.state = {isOpen: false};
    }

    /**
     * 组件渲染完毕
     * @description 类似于window.onload
     */
    componentDidMount() {
        document.addEventListener('mousedown', this.onOutsideClick);
    }

    /**
     * 组件要被从界面上移除
     */
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.onOutsideClick);
    }

    /**
     * 在组件外边点击
     * @param e
     */
    onOutsideClick(e) {
        if (!this.state.isOpen) {
            return;
        }

        e.stopPropagation();//阻止冒泡
        const localNode = ReactDOM.findDOMNode(this);
        let source = e.target;

        while (source.parentNode) {
            if (source === localNode) {
                return;
            }
            source = source.parentNode;
        }

        this.setState({
            isOpen: false,
        });
    }

    /**
     * 切换正在打开状态
     */
    toggleIsOpen() {
        this.setState({isOpen: !this.state.isOpen});
    }

    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        const {isOpen} = this.state;
        const {className, children} = this.props;

        return (
            <div
                className={`${className} popover ${(isOpen ? ' open' : '')}`}
                onClick={this.toggleIsOpen}
            >
                {children[0]}
                {isOpen ? children[1] : null}
            </div>
        );
    }
}

Popover.propTypes = propTypes;

export default Popover;
