import React, {Component, PropTypes} from 'react';

export default function (InnerComponent) {
    /**
     *  无限滚动组件
     */
    class InfiniteScrollComponent extends Component {
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
            if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 200)) {
                const {dispatch, scrollFunc} = this.props;
                dispatch(scrollFunc());
            }
        }

        /**
         * 渲染
         * @returns {XML}
         */
        render() {
            return <InnerComponent {...this.props} />;
        }
    }
    /**
     * 属性验证
     * @type {{dispatch: *, scrollFunc: *}}
     */
    InfiniteScrollComponent.propTypes = {
        dispatch: PropTypes.func.isRequired,
        scrollFunc: PropTypes.func.isRequired,
    };

    return InfiniteScrollComponent;
}
