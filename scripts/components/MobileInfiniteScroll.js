import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';

/**
 * 属性验证
 * @type {{children, className, dispatch: *, scrollFunc: *}}
 */
const propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    scrollFunc: PropTypes.func.isRequired,
};


/**
 * 移动无限滚动
 */
class MobileInfiniteScroll extends Component {
    /**
     * 构造器
     * @param props
     */
    constructor(props) {
        super(props);
        this.onScroll = this.onScroll.bind(this);
    }

    /**
     * 组件渲染完毕
     * @description 类似于window.onload
     */
    componentDidMount() {
        const el = ReactDOM.findDOMNode(this.refs.scroll);
        el.addEventListener('scroll', this.onScroll, false);
    }

    /**
     * 组件要被从界面上移除
     */
    componentWillUnmount() {
        const el = ReactDOM.findDOMNode(this.refs.scroll);
        el.removeEventListener('scroll', this.onScroll, false);
    }

    /**
     * 滚动状态
     */
    onScroll() {
        const el = ReactDOM.findDOMNode(this.refs.scroll);
        if (el.scrollTop >= (el.scrollHeight - el.offsetHeight - 200)) {
            this.props.dispatch(this.props.scrollFunc());
        }
    }

    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        return (
            <div className={this.props.className} ref="scroll">
                {this.props.children}
            </div>
        );
    }
}

MobileInfiniteScroll.propTypes = propTypes;

export default MobileInfiniteScroll;
