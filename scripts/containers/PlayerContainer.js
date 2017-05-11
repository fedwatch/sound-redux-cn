import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import MobilePlayer from '../components/MobilePlayer';
import Player from '../components/Player';
import {getPlayingSongId} from '../utils/PlayerUtils';

/**
 * 属性验证
 * @type {{isMobile: *, playingSongId: (*)}}
 */
const propTypes = {
    isMobile: PropTypes.bool,
    playingSongId: PropTypes.number,
};

/**
 * 播放器容器
 */
class PlayerContainer extends Component {
    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        const {isMobile, playingSongId} = this.props;
        if (isMobile) {
            return <MobilePlayer {...this.props} />;
        }

        if (playingSongId === null) {
            return <div />;
        }

        return <Player {...this.props} />;
    }
}

PlayerContainer.propTypes = propTypes;

/**
 * 映射状态到属性
 * @param state
 * @returns {{isMobile: *, player: *, playingSongId: null, playlists: *, songs: *, users: *}}
 */
function mapStateToProps(state) {
    const {entities, environment, player, playlists} = state;
    const {isMobile} = environment;
    const {songs, users} = entities;
    const playingSongId = getPlayingSongId(player, playlists);

    return {
        isMobile,
        player,
        playingSongId,
        playlists,
        songs,
        users,
    };
}

export default connect(mapStateToProps)(PlayerContainer);
