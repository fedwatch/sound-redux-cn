import React, {Component, PropTypes} from 'react';
import {fetchSongsIfNeeded} from '../actions/PlaylistsActions';
import MobileSongList from '../components/MobileSongList';

/**
 * 属性验证
 * @type {{dispatch: *, playingSongId: (*), playlist: *, playlists: *, songs: *, users: *}}
 */
const propTypes = {
    dispatch: PropTypes.func.isRequired,
    playingSongId: PropTypes.number,
    playlist: PropTypes.string.isRequired,
    playlists: PropTypes.object.isRequired,
    songs: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
};

/**
 * 移动版：歌曲库
 */
class MobileSongs extends Component {
    /**
     * 组件预渲染
     */
    componentWillMount() {
        const {dispatch, playlist, playlists} = this.props;
        if (!(playlist in playlists) || playlists[playlist].items.length === 0) {
            dispatch(fetchSongsIfNeeded(playlist));
        }
    }


    /**
     * 组件接收新Props
     * @description 组件接收到新的 props 的时候调用，每次接受新的props触发
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        const {dispatch, playlist, playlists} = this.props;
        if (playlist !== nextProps.playlist) {
            if (!(nextProps.playlist in playlists) || playlists[nextProps.playlist].items.length === 0) {
                dispatch(fetchSongsIfNeeded(nextProps.playlist));
            }
        }
    }

    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        const {dispatch, playingSongId, playlist, playlists, songs, users} = this.props;

        return (
            <MobileSongList
                playlist={playlist}
                playlists={playlists}
                songs={songs}
                users={users}
                playingSongId={playingSongId}
                dispatch={dispatch}
            />
        );
    }
}

MobileSongs.propTypes = propTypes;

export default MobileSongs;
