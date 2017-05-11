import React, {Component} from 'react';

/**
 *
 * @param InnerComponent
 * @param scrollHeight
 * @returns {StickyComponent}
 */
export default function (InnerComponent, scrollHeight) {
    /**
     * 悬停组件
     */
    class StickyComponent extends Component {
        /**
         * 构造器
         * @param props
         */
        constructor(props) {
            super(props);
            this.onScroll = this.onScroll.bind(this);
            this.state = {sticky: false};
        }

        /**
         * 组件渲染完毕
         * @description 类似于window.onload
         */
        componentDidMount() {
            window.addEventListener('scroll', this.onScroll, false);
        }

        /**
         * 组件要被从界面上移除
         */
        componentWillUnmount() {
            window.removeEventListener('scroll', this.onScroll, false);
        }

        /**
         * 滚动状态
         */
        onScroll() {
            if (window.scrollY >= scrollHeight && !this.state.sticky) {
                this.setState({sticky: true});
            } else if (window.scrollY < scrollHeight && this.state.sticky) {
                this.setState({sticky: false});
            }
        }

        /**
         * 渲染
         * @returns {XML}
         */
        render() {
            return <InnerComponent {...this.props} sticky={this.state.sticky}/>;
        }
    }

    return StickyComponent;
}
