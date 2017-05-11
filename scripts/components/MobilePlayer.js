import React, {Component, PropTypes} from 'react';
import {Motion, spring} from 'react-motion';
import MobilePlayerContent from '../components/MobilePlayerContent';

/**
 * 属性验证
 * @type {{playingSongId: (*)}}
 */
const propTypes = {
    playingSongId: PropTypes.number,
};

/**
 * 移动版:播放器
 */
class MobilePlayer extends Component {
    /**
     * 渲染播放器内容
     * @returns {XML}
     */
    renderPlayerContent() {
        const {playingSongId} = this.props;
        if (playingSongId === null) {
            return <div />;
        }

        return <MobilePlayerContent {...this.props} />;
    }

    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        const {playingSongId} = this.props;
        const isSongPlaying = playingSongId !== null;
        return (
            <Motion style={{height: spring(isSongPlaying ? 100 : 0)}}>
                {({height}) =>
                    <div className="mobile-player-container" style={{height}}>
                        {this.renderPlayerContent()}
                    </div>
                }
            </Motion>
        );
    }
}

MobilePlayer.propTypes = propTypes;

export default MobilePlayer;
