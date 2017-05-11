import React, {Component, PropTypes} from 'react';
import Comment from '../components/Comment';
import SidebarContent from '../components/SidebarContent';
import Switch from '../components/Switch';

const COMMENTS_REFRESH_RATE = 10;

/**
 * 属性验证
 * @type {{comments: *, height: *, isActive: *}}
 */
const propTypes = {
    comments: PropTypes.array.isRequired,
    height: PropTypes.number.isRequired,
    isActive: PropTypes.bool.isRequired,
};

/**
 * 评论集展示组件
 */
class Comments extends Component {
    /**
     * 构造器
     * @param props
     */
    constructor(props) {
        super(props);
        this.toggleTimedComments = this.toggleTimedComments.bind(this);
        this.state = {
            className: null,
            currentTime: 0,
            timedComments: false,
        };
    }

    /**
     * 组件接收新Props
     * @description 组件接收到新的 props 的时候调用
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        const {currentTime, timedComments} = this.state;

        if (!timedComments || !nextProps.isActive) {
            return;
        }

        if (nextProps.currentTime % COMMENTS_REFRESH_RATE === 0
            || Math.abs(nextProps.currentTime - currentTime) > COMMENTS_REFRESH_RATE) {
            this.setState({
                className: 'animate-out',
            }, () => {
                setTimeout(() => this.setState({
                    className: null,
                    currentTime: nextProps.currentTime,
                }), 200);
            });
        }
    }

    /**
     * 处理鼠标进入
     */
    handleMouseEnter() {
        document.body.style.overflow = 'hidden';
    }

    /**
     * 处理鼠标离开
     */
    handleMouseLeave() {
        document.body.style.overflow = 'auto';
    }

    /**
     * 切换时间评论
     */
    toggleTimedComments() {
        this.setState({
            timedComments: !this.state.timedComments,
        });
    }

    /**
     * 渲染评论
     * @returns {Array}
     */
    renderComments() {
        const {currentTime, timedComments} = this.state;
        const {comments, isActive} = this.props;

        if (isActive && timedComments) {
            return comments
                .slice()
                .filter(song => {
                    const songTime = song.timestamp / 1000;
                    return songTime >= currentTime && songTime < (currentTime + COMMENTS_REFRESH_RATE);
                })
                .sort((a, b) => a.timestamp - b.timestamp)
                .map((comment, i) => <Comment comment={comment} i={i} key={comment.id}/>);
        }

        return comments
            .slice()
            .sort((a, b) => a.timestamp - b.timestamp)
            .map((comment, i) => <Comment comment={comment} i={i} key={comment.id}/>);
    }

    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        const {height, isActive} = this.props;
        const {className, timedComments} = this.state;

        return (
            <div className={`comments${(isActive && timedComments ? ' timed' : '')}`}>
                <div className="comments-header">
                    <div className="comments-header-title">
                        Comments
                    </div>
                    <Switch
                        isOn={timedComments}
                        toggleFunc={this.toggleTimedComments}
                    />
                </div>
                <SidebarContent
                    className={className}
                    height={height - 220}
                >
                    {this.renderComments()}
                </SidebarContent>
            </div>
        );
    }
}

Comments.propTypes = propTypes;

export default Comments;
