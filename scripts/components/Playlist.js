import React, {Component, PropTypes} from 'react';
import {playSong} from '../actions/PlayerActions';
import {getImageUrl} from '../utils/SongUtils';

/**
 * 属性验证
 * @type {{dispatch: *, player: *, playlists: *, songs: *}}
 */
const propTypes = {
    dispatch: PropTypes.func.isRequired,
    player: PropTypes.object.isRequired,
    playlists: PropTypes.object.isRequired,
    songs: PropTypes.object.isRequired,
};

/**
 * 播放列表
 */
class Playlist extends Component {
    /**
     * 构造器
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {shownPlaylistIndex: null};
    }

    /**
     * 组件要被从界面上移除
     */
    componentWillUnmount() {
        this.setState({shownPlaylistIndex: null});
    }

    /**
     * 获取显露播放列表当前索引
     * @returns {*}
     */
    getShownPlaylistIndex() {
        const {selectedPlaylists} = this.props.player;
        const {shownPlaylistIndex} = this.state;
        const lastPlaylistIndex = selectedPlaylists.length - 1;
        if (shownPlaylistIndex === null) {
            return lastPlaylistIndex;
        }

        return shownPlaylistIndex;
    }

    /**
     * 获取正在显示播放列表
     * @param shownPlaylistIndex
     * @returns {*}
     */
    getShownPlaylist(shownPlaylistIndex) {
        const {selectedPlaylists} = this.props.player;
        return selectedPlaylists[shownPlaylistIndex];
    }

    /**
     * 是否正在播放的歌曲
     * @param currentPlaylist
     * @param currentSongIndex
     * @param i
     * @param shownPlaylist
     * @returns {boolean}
     */
    isActiveSong(currentPlaylist, currentSongIndex, i, shownPlaylist) {
        return currentPlaylist === shownPlaylist && i === currentSongIndex;
    }

    /**
     * 改变显露播放列表当前索引
     * @param i
     * @param e
     */
    changeShownPlaylistIndex(i, e) {
        e.preventDefault();
        const {player} = this.props;
        const {selectedPlaylists} = player;
        if (i < 0 || i >= selectedPlaylists.length) {
            return;
        }

        this.setState({shownPlaylistIndex: i});
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
     * 播放歌曲
     * @param shownPlaylist
     * @param i
     */
    playSong(shownPlaylist, i) {
        const {dispatch} = this.props;
        dispatch(playSong(shownPlaylist, i));
        this.setState({shownPlaylistIndex: null});
    }

    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        const {playlists, player, songs} = this.props;
        const {currentSongIndex, selectedPlaylists} = player;
        const currentPlaylist = selectedPlaylists[selectedPlaylists.length - 1];
        const shownPlaylistIndex = this.getShownPlaylistIndex();
        const shownPlaylist = this.getShownPlaylist(shownPlaylistIndex);
        const stopPropagationFunc = e => {
            e.stopPropagation();
        };

        const prevPlaylistFunc = this.changeShownPlaylistIndex.bind(this, shownPlaylistIndex - 1);
        const isFirstPlaylist = shownPlaylistIndex === 0;
        const isLastPlaylist = shownPlaylistIndex === selectedPlaylists.length - 1;
        const nextPlaylistFunc = this.changeShownPlaylistIndex.bind(this, shownPlaylistIndex + 1);

        const items = playlists[shownPlaylist].items.map((songId, i) => {
            const song = songs[songId];
            const isActiveSong = this.isActiveSong(currentPlaylist, currentSongIndex, i, shownPlaylist);
            const playSongFunc = this.playSong.bind(this, shownPlaylist, i);
            return (
                <li
                    className={`playlist-song ${(isActiveSong ? ' active' : '')}`}
                    key={`${song.id}-${i}`}
                    onClick={playSongFunc}
                >
                    <img
                        alt="song artwork"
                        className="playlist-song-image"
                        src={getImageUrl(song.artwork_url)}
                    />
                    <div className="playlist-song-title">{song.title}</div>
                </li>
            );
        });

        return (
            <div
                className="popover-content playlist"
                onClick={stopPropagationFunc}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            >
                <div className="playlist-header">
                    <a
                        className={`playlist-header-button ${(isFirstPlaylist ? ' disabled' : '')}`}
                        href="#"
                        onClick={prevPlaylistFunc}
                    >
                        <i className="icon ion-ios-arrow-back"/>
                    </a>
                    <div className="playlist-header-title">
                        {shownPlaylist.split('|')[0]}
                    </div>
                    <a
                        className={`playlist-header-button ${(isLastPlaylist ? ' disabled' : '')}`}
                        href="#"
                        onClick={nextPlaylistFunc}
                    >
                        <i className="icon ion-ios-arrow-forward"/>
                    </a>
                </div>
                <div className="playlist-body">
                    <ul className="playlist-songs">
                        {items}
                    </ul>
                </div>
                <div className="playlist-footer">
                    {items.length + (items.length === 1 ? ' Song' : ' Songs')}
                </div>
            </div>
        );
    }
}

Playlist.propTypes = propTypes;

export default Playlist;
