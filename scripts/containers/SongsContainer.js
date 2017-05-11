import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {fetchSongsIfNeeded} from '../actions/PlaylistsActions';
import MobileSongs from '../components/MobileSongs';
import Songs from '../components/Songs';
// import ReactLevelExam from '../components/Form/ReactLevelExam';
import {getPlayingSongId} from '../utils/PlayerUtils';

/**
 * 属性验证
 * @type {{isMobile: *}}
 */
const propTypes = {
    isMobile: PropTypes.bool,
};

/**
 * 歌曲库容器
 */
class SongsContainer extends Component {
    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        const {isMobile} = this.props;
        if (isMobile) {
            return <MobileSongs {...this.props} />;
        }

        return(
            <div>
                {/*<ReactLevelExam/>*/}
                <Songs {...this.props} />

            </div>

            );
    }
}

SongsContainer.propTypes = propTypes;

/**
 * 映射状态到属性
 * @param state
 * @returns {{authed: *, height: *, isMobile: *, playingSongId: null, playlist: *, playlists: *, scrollFunc: (function(this:null)), songs: *, time: null, users: *}}
 */
function mapStateToProps(state) {
    const {authed, entities, environment, navigator, player, playlists} = state;
    const {height, isMobile} = environment;
    const {songs, users} = entities;
    const {query} = navigator.route;
    const playingSongId = getPlayingSongId(player, playlists);

    const time = query && query.t ? query.t : null;
    let playlist = query && query.q ? query.q : 'house';

    if (time) {
        playlist = `${playlist} - ${time}`;
    }

    return {
        authed,
        height,
        isMobile,
        playingSongId,
        playlist,
        playlists,
        scrollFunc: fetchSongsIfNeeded.bind(null, playlist),
        songs,
        time,
        users,
    };
}

export default connect(mapStateToProps)(SongsContainer);
