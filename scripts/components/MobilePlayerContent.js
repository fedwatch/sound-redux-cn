import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {changeCurrentTime, changeSong, toggleIsPlaying} from '../actions/PlayerActions';
import {CHANGE_TYPES, IMAGE_SIZES} from '../constants/SongConstants';
import {formatSongTitle, formatStreamUrl} from '../utils/FormatUtils';
import {getImageUrl} from '../utils/SongUtils';

/**
 * 属性验证
 * @type {{dispatch: *, playingSongId: (*), player: *, songs: *, users: *}}
 */
const propTypes = {
    dispatch: PropTypes.func.isRequired,
    playingSongId: PropTypes.number,
    player: PropTypes.object.isRequired,
    songs: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
};

/**
 * 移动版:播放器内容
 */
class MobilePlayerContent extends Component {
    /**
     * 构造器
     * @param props
     */
    constructor(props) {
        super(props);

        this.changeSong = this.changeSong.bind(this);
        this.handleEnded = this.handleEnded.bind(this);
        this.handleLoadedMetadata = this.handleLoadedMetadata.bind(this);
        this.handleLoadStart = this.handleLoadStart.bind(this);
        this.handlePlay = this.handlePlay.bind(this);
        this.handlePause = this.handlePause.bind(this);
        this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
        this.togglePlay = this.togglePlay.bind(this);

        this.state = {
            duration: 0,
            repeat: false,
            shuffle: false,
        };
    }

    /**
     * 组件渲染完毕
     * @description 类似于window.onload
     */
    componentDidMount() {
        const audioElement = ReactDOM.findDOMNode(this.refs.audio);
        audioElement.addEventListener('ended', this.handleEnded, false);
        audioElement.addEventListener('loadedmetadata', this.handleLoadedMetadata, false);
        audioElement.addEventListener('loadstart', this.handleLoadStart, false);
        audioElement.addEventListener('pause', this.handlePause, false);
        audioElement.addEventListener('play', this.handlePlay, false);
        audioElement.addEventListener('timeupdate', this.handleTimeUpdate, false);
        audioElement.play();
    }

    /**
     * 组件完成更新
     * @param prevProps
     */
    componentDidUpdate(prevProps) {
        if (prevProps.playingSongId && prevProps.playingSongId === this.props.playingSongId) {
            return;
        }

        ReactDOM.findDOMNode(this.refs.audio).play();
    }

    /**
     * 组件要被从界面上移除
     */
    componentWillUnmount() {
        const audioElement = ReactDOM.findDOMNode(this.refs.audio);
        audioElement.removeEventListener('ended', this.handleEnded, false);
        audioElement.removeEventListener('loadedmetadata', this.handleLoadedMetadata, false);
        audioElement.removeEventListener('loadstart', this.handleLoadStart, false);
        audioElement.removeEventListener('pause', this.handlePause, false);
        audioElement.removeEventListener('play', this.handlePlay, false);
        audioElement.removeEventListener('timeupdate', this.handleTimeUpdate, false);
    }

    /**
     * 更改歌曲
     * @param changeType
     * @param e
     */
    changeSong(changeType, e) {
        if (e) {
            e.preventDefault();
        }

        const {dispatch} = this.props;
        dispatch(changeSong(changeType));
    }

    /**
     * 处理完成
     */
    handleEnded() {
        if (this.state.repeat) {
            ReactDOM.findDOMNode(this.refs.audio).play();
        } else if (this.state.shuffle) {
            this.changeSong(CHANGE_TYPES.SHUFFLE);
        } else {
            this.changeSong(CHANGE_TYPES.NEXT);
        }
    }

    /**
     * 处理载入完成元数据
     */
    handleLoadedMetadata() {
        const audioElement = ReactDOM.findDOMNode(this.refs.audio);
        this.setState({
            duration: Math.floor(audioElement.duration),
        });
    }

    /**
     * 处理加载开始
     */
    handleLoadStart() {
        const {dispatch} = this.props;
        dispatch(changeCurrentTime(0));
        this.setState({
            duration: 0,
        });
    }

    /**
     * 处理暂停
     */
    handlePause() {
        const {dispatch} = this.props;
        dispatch(toggleIsPlaying(false));
    }

    /**
     * 处理播放
     */
    handlePlay() {
        const {dispatch} = this.props;
        dispatch(toggleIsPlaying(true));
    }

    /**
     * 处理时间更新
     */
    handleTimeUpdate(e) {
        const {dispatch, player} = this.props;
        const audioElement = e.currentTarget;
        const currentTime = Math.floor(audioElement.currentTime);

        if (currentTime === player.currentTime) {
            return;
        }

        dispatch(changeCurrentTime(currentTime));
    }

    /**
     * 切换播放
     */
    togglePlay(e) {
        e.preventDefault();
        const {isPlaying} = this.props.player;
        const audioElement = ReactDOM.findDOMNode(this.refs.audio);
        if (isPlaying) {
            audioElement.pause();
        } else {
            audioElement.play();
        }
    }

    /**
     * 渲染连续展示边栏
     */
    renderDurationBar() {
        const {currentTime} = this.props.player;
        const {duration} = this.state;

        if (duration !== 0) {
            const width = currentTime / duration * 100;
            return (
                <div
                    className="mobile-player-seek-duration-bar"
                    style={{width: `${width}%`}}
                />
            );
        }

        return null;
    }

    /**
     * 渲染
     */
    render() {
        const {player, playingSongId, songs, users} = this.props;
        const {isPlaying} = player;
        const song = songs[playingSongId];
        const user = users[song.user_id];
        const image = getImageUrl(song.artwork_url, IMAGE_SIZES.XLARGE);
        const prevFunc = this.changeSong.bind(this, CHANGE_TYPES.PREV);
        const nextFunc = this.changeSong.bind(this, CHANGE_TYPES.NEXT);

        return (
            <div className="mobile-player" style={{backgroundImage: `url(${image})`}}>
                <audio id="audio" ref="audio" src={formatStreamUrl(song.stream_url)}></audio>
                <div className="mobile-player-bg"/>
                <div className="mobile-player-extras"/>
                <div className="mobile-player-content fade-in">
                    <div className="mobile-player-info">
                        <div className="mobile-player-title">
                            {formatSongTitle(song.title)}
                        </div>
                        <div className="mobile-player-user">
                            {user.username}
                        </div>
                    </div>
                    <div className="mobile-player-controls">
                        <a
                            className="mobile-player-button"
                            href="#"
                            onClick={prevFunc}
                        >
                            <i className="icon ion-ios-rewind"></i>
                        </a>
                        <a
                            className="mobile-player-button"
                            href="#"
                            onClick={this.togglePlay}
                        >
                            <i className={isPlaying ? 'ion-ios-pause' : 'ion-ios-play'}/>
                        </a>
                        <a
                            className="mobile-player-button"
                            href="#"
                            onClick={nextFunc}
                        >
                            <i className="ion-ios-fastforward"/>
                        </a>
                    </div>
                </div>
                <div className="mobile-player-seek-bar">
                    {this.renderDurationBar()}
                </div>
            </div>
        );
    }
}

MobilePlayerContent.propTypes = propTypes;

export default MobilePlayerContent;
