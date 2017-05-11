import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {navigateTo} from '../actions/NavigatorActions';
/**
 * 属性验证
 * @type {{dispatch: *}}
 */
const propTypes = {
    dispatch: PropTypes.func.isRequired,
};

/**
 * 导航搜索
 */
class NavSearch extends Component {
    /**
     * 构造器
     * @param props
     */
    constructor(props) {
        super(props);
        this.handleOnKeyPress = this.handleOnKeyPress.bind(this);
        this.handleSlashPress = this.handleSlashPress.bind(this);
    }

    /**
     * 组件渲染完毕
     * @description 类似于window.onload
     */
    componentDidMount() {
        document.addEventListener('keypress', this.handleSlashPress, false);
    }

    /**
     * 组件要被从界面上移除
     */
    componentWillUnmount() {
        document.removeEventListener('keypress', this.handleSlashPress, false);
    }

    /**
     * 处理击键响应
     */
    handleOnKeyPress(e) {
        if (e.charCode === 13) {
            const {dispatch} = this.props;
            const value = e.currentTarget.value.trim();
            if (value !== '') {
                dispatch(navigateTo({path: ['songs'], query: {q: value}}));
            }
        }
    }

    /**
     * 处理输入数据
     * @param e
     */
    handleSlashPress(e) {
        const keyCode = e.keyCode || e.which;
        const isInsideInput = e.target.tagName.toLowerCase().match(/input|textarea/);
        if (keyCode === 47 && !isInsideInput) {
            e.preventDefault();
            ReactDOM.findDOMNode(this.refs.query).focus();
        }
    }

    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        return (
            <div className="nav-search">
                <i className="icon ion-search"/>
                <input
                    ref="query"
                    className="nav-search-input"
                    placeholder="搜索"
                    onKeyPress={this.handleOnKeyPress}
                    type="text"
                />
            </div>
        );
    }
}

NavSearch.propTypes = propTypes;

export default NavSearch;
