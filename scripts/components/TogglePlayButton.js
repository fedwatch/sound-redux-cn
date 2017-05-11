import React, {Component, PropTypes} from 'react';

/**
 * 属性验证
 * @type {{isPlaying: *}}
 */
const propTypes = {
    isPlaying: PropTypes.bool.isRequired,
};

/**
 * 切换播放按钮
 */
class TogglePlayButton extends Component {
    /**
     * 构造器
     */
    constructor() {
        super();
        this.togglePlay = this.togglePlay.bind(this);
    }

    /**
     * 切换播放
     */
    togglePlay() {
        const {isPlaying} = this.props;
        const audioElement = document.getElementById('audio');
        if (!audioElement) {
            return;
        }

        if (isPlaying) {
            audioElement.pause();
        } else {
            audioElement.play();
        }
    }

    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        const {isPlaying} = this.props;
        return (
            <div
                className={`toggle-play-button active ${(isPlaying ? 'is-playing' : '')}`}
                onClick={this.togglePlay}
            >
                <i className="toggle-play-button-icon ion-radio-waves"/>
                <i className="toggle-play-button-icon ion-ios-play"/>
            </div>
        );
    }
}

TogglePlayButton.propTypes = propTypes;

export default TogglePlayButton;
