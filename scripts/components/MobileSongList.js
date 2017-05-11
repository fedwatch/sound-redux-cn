import React, {Component, PropTypes} from 'react';
import {fetchSongsIfNeeded} from '../actions/PlaylistsActions';
import {playSong} from '../actions/PlayerActions';
import MobileSongListItem from '../components/MobileSongListItem';
import MobileInfiniteScroll from '../components/MobileInfiniteScroll';
import Spinner from '../components/Spinner';

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
 * 移动版：歌曲列表
 */
class MobileSongList extends Component {
    /**
     * 播放歌曲
     * @param playlist
     * @param i
     * @param e
     */
    playSong(playlist, i, e) {
        e.preventDefault();
        const {dispatch} = this.props;
        dispatch(playSong(playlist, i));
    }

    /**
     * 渲染歌曲列表子项目
     * @returns {null}
     */
    renderSongsListItems() {
        const {playingSongId, playlist, playlists, songs, users} = this.props;
        if (!(playlist in playlists)) {
            return null;
        }

        return playlists[playlist].items.map((songId, i) => {
            const song = songs[songId];
            const user = users[song.user_id];
            const playSongFunc = this.playSong.bind(this, playlist, i);
            return (
                <MobileSongListItem
                    key={`${songId}-${i}`}
                    isActive={song.id === playingSongId}
                    playSong={playSongFunc}
                    song={song}
                    user={user}
                />
            );
        });
    }

    /**
     * 渲染旋转动画
     * @returns {*}
     */
    renderSpinner() {
        const {playlist, playlists} = this.props;
        if (!(playlist in playlists) || playlists[playlist].isFetching) {
            return <Spinner />;
        }

        return null;
    }

    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        const {dispatch, playlist} = this.props;
        return (
            <MobileInfiniteScroll
                className="mobile-songs"
                dispatch={dispatch}
                scrollFunc={fetchSongsIfNeeded.bind(null, playlist)}
            >
                {this.renderSongsListItems()}
                {this.renderSpinner()}
            </MobileInfiniteScroll>
        );
    }
}

MobileSongList.propTypes = propTypes;

export default MobileSongList;
