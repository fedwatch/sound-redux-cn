import React, {Component} from 'react';
import {connect} from 'react-redux';
import Song from '../components/Song';
// import ReactLevelExam from '../components/Form/ReactLevelExam';
import {getPlayingSongId} from '../utils/PlayerUtils';

/**
 * 歌曲容器
 */
class SongContainer extends Component {
    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        return(
            <div>
                <Song {...this.props} />
                {/*<ReactLevelExam/>*/}
            </div>
            )

        ;
    }
}

/**
 * 映射状态到属性
 * @param state
 * @returns {{authed: *, height: *, player: *, playingSongId: null, playlists: *, songId: number, songs: *, users: *}}
 */
function mapStateToProps(state) {
    const {authed, entities, environment, navigator, player, playlists} = state;
    const {songs, users} = entities;
    const {height} = environment;
    const {path} = navigator.route;
    const songId = Number(path[1]);

    const playingSongId = getPlayingSongId(player, playlists);

    return {
        authed,
        height,
        player,
        playingSongId,
        playlists,
        songId,
        songs,
        users,
    };
}

export default connect(mapStateToProps)(SongContainer);
