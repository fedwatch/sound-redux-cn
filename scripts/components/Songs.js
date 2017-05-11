import React, {Component, PropTypes} from 'react';

import {fetchSongsIfNeeded} from '../actions/PlaylistsActions';

import SongCards from '../components/SongCards';
import stickify from '../components/Stickify';
import Toolbar from '../components/Toolbar';

/**
 * 属性验证
 * @type {{authed: (*), dispatch: *, height: (*), playingSongId: (*), playlist, playlists: *, sticky: *, songs: *, time: (*), users: *}}
 */
const propTypes = {
    authed: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    height: PropTypes.number,
    playingSongId: PropTypes.number,
    playlist: PropTypes.string,
    playlists: PropTypes.object.isRequired,
    sticky: PropTypes.bool,
    songs: PropTypes.object.isRequired,
    time: PropTypes.number,
    users: PropTypes.object.isRequired,
};

/**
 * 歌曲
 */
class Songs extends Component {
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
     * @description 组件接收到新的 props 的时候调用
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
        const {
            authed,
            dispatch,
            height,
            playingSongId,
            playlist,
            playlists,
            sticky,
            songs,
            time,
            users,
        } = this.props;

        return (
            <div className={`songs ${(sticky ? 'sticky' : '')}`}>
                <Toolbar dispatch={dispatch} playlist={playlist} sticky={sticky} time={time}/>
                <div className="container">
                    <SongCards
                        authed={authed}
                        dispatch={dispatch}
                        height={height}
                        playingSongId={playingSongId}
                        playlist={playlist}
                        playlists={playlists}
                        scrollFunc={fetchSongsIfNeeded.bind(null, playlist)}
                        songs={songs}
                        users={users}
                    />
                </div>
            </div>
        );
    }
}

Songs.propTypes = propTypes;

export default stickify(Songs, 50);
