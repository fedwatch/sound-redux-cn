import React, {Component, PropTypes} from 'react';
import {IMAGE_SIZES} from '../constants/SongConstants';
import {formatSeconds} from '../utils/FormatUtils';
import {getImageUrl} from '../utils/SongUtils';

/**
 * 属性验证
 * @type {{comment: *, i: *}}
 */
const propTypes = {
    comment: PropTypes.object.isRequired,
    i: PropTypes.number.isRequired,
};

/**
 * 评论展示组件
 */
class Comment extends Component {
    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        const {comment, i} = this.props;
        const {user} = comment;
        const image = getImageUrl(user.avatar_url, IMAGE_SIZES.LARGE);

        return (
            <div className="comment" style={{animationDelay: `${(i * 50)}ms`}}>
                <div className="comment-image"
                    style={{backgroundImage: `url(${image})`}}
                />
                <div className="comment-info">
                    <div className="comment-comment">
                        {comment.body}
                    </div>
                    <div className="comment-username">
                        {user.username}
                    </div>
                </div>
                <div className="comment-time">
                    {formatSeconds(Math.floor(comment.timestamp / 1000))}
                </div>
            </div>
        );
    }
}

Comment.propTypes = propTypes;

export default Comment;
