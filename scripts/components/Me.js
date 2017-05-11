import React, {Component, PropTypes} from 'react';
import {fetchSongsIfNeeded} from '../actions/PlaylistsActions';
import MePromptStream from '../components/MePromptStream';
import MePromptLikes from '../components/MePromptLikes';
import SongCards from '../components/SongCards';
import {AUTHED_PLAYLIST_SUFFIX} from '../constants/PlaylistConstants';

/**
 * 属性验证
 * @type {{authed: *, authedPlaylists: *, dispatch: *, height: *, playingSongId: (*), playlists: *, route: *, songs: *, users: *}}
 */
const propTypes = {
    authed: PropTypes.object.isRequired,
    authedPlaylists: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    height: PropTypes.number.isRequired,
    playingSongId: PropTypes.number,
    playlists: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    songs: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
};

/**
 * Me展示组件
 */
class Me extends Component {
    /**
     * 获取播放列表
     * @returns {*}
     */
    getPlaylist() {
        const {authedPlaylists, route} = this.props;
        const {path} = route;

        switch (path[1]) {
            case 'stream':
                return 'stream';
            case 'likes':
                return 'likes';
            case 'playlists': {
                if (path.length < 3 || !(path[2] in authedPlaylists)) {
                    return 'playlists';
                }
                const playlist = authedPlaylists[path[2]];
                return playlist.title;
            }
            default:
                return 'stream';
        }
    }

    /**
     * 渲染提示框
     * @returns {*}
     */
    renderPrompt() {
        const {authed, dispatch, playlists} = this.props;
        switch (this.getPlaylist()) {
            case 'stream':
                return (
                    <MePromptStream
                        authed={authed}
                        dispatch={dispatch}
                    />
                );
            case 'likes':
                return (
                    <MePromptLikes
                        authed={authed}
                        dispatch={dispatch}
                        playlists={playlists}
                    />
                );
            default:
                return null;
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
            playlists,
            songs,
            users,
        } = this.props;
        const playlist = this.getPlaylist() + AUTHED_PLAYLIST_SUFFIX;
        return (
            <div className="me">
                {this.renderPrompt()}
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

Me.propTypes = propTypes;

export default Me;
