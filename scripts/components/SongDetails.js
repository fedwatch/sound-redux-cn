import React, {Component, PropTypes} from 'react';
import Link from '../components/Link';
import {formatSongTitle} from '../utils/FormatUtils';

/**
 * 属性验证
 * @type {{dispatch: *, songId: (*), title: *, userId: (*), username: *}}
 */
const propTypes = {
    dispatch: PropTypes.func.isRequired,
    songId: PropTypes.number,
    title: PropTypes.string.isRequired,
    userId: PropTypes.number,
    username: PropTypes.string.isRequired,
};

/**
 * 歌曲详情
 */
class SongDetails extends Component {
    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        const {dispatch, songId, title, userId, username} = this.props;
        return (
            <div className="song-card-details">
                <Link
                    className="song-card-title"
                    dispatch={dispatch}
                    route={{path: ['songs', songId]}}
                    title={title}
                >
                    {formatSongTitle(title)}
                </Link>
                <Link
                    className="song-card-user-username"
                    dispatch={dispatch}
                    route={{path: ['users', userId]}}
                    title={username}
                >
                    {username}
                </Link>
            </div>
        );
    }
}

SongDetails.propTypes = propTypes;

export default SongDetails;
