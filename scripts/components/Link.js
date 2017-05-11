import React, {Component, PropTypes} from 'react';
import {navigateTo} from '../actions/NavigatorActions';
import {constructUrl} from '../utils/RouteUtils';

/**
 * 属性验证
 * @type {{children, className, dispatch: *, route: *, title}}
 */
const propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    route: PropTypes.object.isRequired,
    title: PropTypes.string,
};

/**
 * 链接展示组件
 */
class Link extends Component {
    /**
     * 构造器
     * @param props
     */
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    /**
     * 处理点击
     * @param e
     */
    handleClick(e) {
        e.preventDefault();
        const {dispatch, route} = this.props;
        dispatch(navigateTo(route));
    }

    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        const {children, className, route, title} = this.props;

        return (
            <a
                className={className}
                href={`/#/${constructUrl(route)}`}
                onClick={this.handleClick}
                title={title ? String(title) : ''}
            >
                {children}
            </a>
        );
    }
}

Link.propTypes = propTypes;

export default Link;
