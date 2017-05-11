import React, {Component, PropTypes} from 'react';

/**
 * 属性验证
 * @type {{children, className, height: (*)}}
 */
const propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    height: PropTypes.number,
};

/**
 * 边栏内容
 */
class SidebarContent extends Component {
    /**
     * 组件要被从界面上移除
     */
    componentWillUnmount() {
        document.body.style.overflow = 'auto';
    }

    /**
     * 处理鼠标进入
     */
    handleMouseEnter() {
        document.body.style.overflow = 'hidden';
    }

    /**
     * 处理鼠标移出
     */
    handleMouseLeave() {
        document.body.style.overflow = 'auto';
    }

    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        const {children, className, height} = this.props;

        return (
            <div
                className={`sidebar-content ${String(className)}`}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                style={{maxHeight: height}}
            >
                {children}
            </div>
        );
    }
}

SidebarContent.propTypes = propTypes;

export default SidebarContent;
