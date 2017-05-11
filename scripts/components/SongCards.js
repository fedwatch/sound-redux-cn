import React, {Component, PropTypes} from 'react';
import {playSong} from '../actions/PlayerActions';
import {fetchSongsIfNeeded} from '../actions/PlaylistsActions';
import infiniteScrollify from '../components/InfiniteScrollify';
import SongCard from '../components/SongCard';
import Spinner from '../components/Spinner';

/**
 * 属性验证
 * @type {{authed: *, dispatch: *, height: (*), playingSongId: (*), playlist: *, playlists: *, songs: *, users: *}}
 */
const propTypes = {
    authed: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    height: PropTypes.number,
    playingSongId: PropTypes.number,
    playlist: PropTypes.string.isRequired,
    playlists: PropTypes.object.isRequired,
    songs: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
};

/**
 * 歌曲卡片集
 */
class SongCards extends Component {
    /**
     * 构造器
     * @param props
     */
    constructor(props) {
        super(props);
        this.getScrollState = this.getScrollState.bind(this);
        this.onScroll = this.onScroll.bind(this);

        const {playlist, playlists} = props;
        const items = playlist in playlists ? playlists[playlist].items : [];
        this.state = {
            end: items.length,
            paddingBottom: 0,
            paddingTop: 0,
            start: 0,
        };
    }

    /**
     * 组件渲染完毕
     * @description 类似于window.onload
     */
    componentDidMount() {
        window.addEventListener('scroll', this.onScroll, false);
    }

    /**
     * 组件接收新Props
     * @description 组件接收到新的 props 的时候调用
     * @param nextProps
     */
    componentWillReceiveProps(nextProps) {
        const {end, paddingBottom, paddingTop, start} = this.getScrollState(nextProps);
        if (paddingTop !== this.state.paddingTop
            || paddingBottom !== this.state.paddingBottom
            || start !== this.state.start
            || end !== this.state.end) {
            this.setState({
                end,
                paddingBottom,
                paddingTop,
                start,
            });
        }
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
        const {end, paddingBottom, paddingTop, start} = this.getScrollState(this.props);
        if (paddingTop !== this.state.paddingTop
            || paddingBottom !== this.state.paddingBottom
            || end !== this.state.end
            || start !== this.state.start) {
            this.setState({
                end,
                paddingBottom,
                paddingTop,
                start,
            });
        }
    }

    /**
     * 获取滚动状态
     * @param props
     * @returns {{end: Number, paddingBottom: number, paddingTop: number, start: number}}
     */
    getScrollState(props) {
        const {height, playlists, playlist} = props;
        const items = playlist in playlists ? playlists[playlist].items : [];

        const MARGIN_TOP = 20;
        const ROW_HEIGHT = 132;
        const ITEMS_PER_ROW = 5;
        const scrollY = window.scrollY;

        let paddingTop = 0;
        let paddingBottom = 0;
        let start = 0;
        let end = items.length;

        if ((scrollY - ((ROW_HEIGHT * 3) + (MARGIN_TOP * 2))) > 0) {
            const rowsToPad = Math.floor(
                (scrollY - ((ROW_HEIGHT * 2) + (MARGIN_TOP))) / (ROW_HEIGHT + MARGIN_TOP)
            );
            paddingTop = rowsToPad * (ROW_HEIGHT + MARGIN_TOP);
            start = rowsToPad * ITEMS_PER_ROW;
        }

        const rowsOnScreen = Math.ceil(height / (ROW_HEIGHT + MARGIN_TOP));
        const itemsToShow = (rowsOnScreen + 5) * ITEMS_PER_ROW;
        if (items.length > (start + itemsToShow)) {
            end = start + itemsToShow;
            const rowsToPad = Math.ceil((items.length - end) / ITEMS_PER_ROW);
            paddingBottom = rowsToPad * (ROW_HEIGHT + MARGIN_TOP);
        }

        return {
            end,
            paddingBottom,
            paddingTop,
            start,
        };
    }

    /**
     * 播放歌曲
     * @param i
     * @param e
     */
    playSong(i, e) {
        e.preventDefault();
        const {playlist, dispatch} = this.props;
        dispatch(playSong(playlist, i));
    }

    /**
     * 渲染歌曲库
     * @param start
     * @param end
     * @returns {Array}
     */
    renderSongs(start, end) {
        const chunk = 5;
        const {authed, dispatch, playlist, playlists, playingSongId, songs, users} = this.props;
        const items = playlist in playlists ? playlists[playlist].items : [];
        const result = [];

        for (let i = start; i < end; i += chunk) {
            const songCards = items.slice(i, i + chunk).map((songId, j) => {
                const song = songs[songId];
                const scrollFunc = fetchSongsIfNeeded.bind(null, playlist);
                const user = users[song.user_id];
                const index = i + j;
                const playSongFunc = this.playSong.bind(this, index);

                return (
                    <div className="col-1-5 clearfix" key={`${index}-${song.id}`}>
                        <SongCard
                            authed={authed}
                            dispatch={dispatch}
                            isActive={song.id === playingSongId}
                            playSong={playSongFunc}
                            scrollFunc={scrollFunc}
                            song={song}
                            user={user}
                        />
                    </div>
                );
            });

            if (songCards.length < chunk) {
                for (let j = 0; j < chunk - songCards.length + 1; j++) {
                    songCards.push(<div className="col-1-5" key={`song-placeholder-${(i + j)}`}/>);
                }
            }

            result.push(
                <div className="songs-row grid" key={`songs-row-${i}`}>
                    {songCards}
                </div>
            );
        }

        return result;
    }

    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        const {playlist, playlists} = this.props;
        const {end, paddingBottom, paddingTop, start} = this.state;
        const isFetching = playlist in playlists ? playlists[playlist].isFetching : false;

        return (
            <div className="content">
                <div className="padder" style={{height: paddingTop}}/>
                {this.renderSongs(start, end)}
                <div className="padder" style={{height: paddingBottom}}/>
                {isFetching ? <Spinner /> : null}
            </div>
        );
    }
}

SongCards.propTypes = propTypes;

export default infiniteScrollify(SongCards);
