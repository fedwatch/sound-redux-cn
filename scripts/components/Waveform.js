import React, {Component, PropTypes} from 'react';
import {changeCurrentTime} from '../actions/PlayerActions';
import {offsetLeft} from '../utils/MouseUtils';

/**
 * 属性验证
 * @type {{currentTime: (*), dispatch: *, duration: (*), isActive: *, playSong, waveformUrl}}
 */
const propTypes = {
    currentTime: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    duration: PropTypes.number,
    isActive: PropTypes.bool,
    playSong: PropTypes.func,
    waveformUrl: PropTypes.string,
};

/**
 * 波浪表单
 */
class Waveform extends Component {
    /**
     * 构造器
     * @param props
     */
    constructor(props) {
        super(props);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.state = {
            isCanvas: false,
            seekPercent: 0,
        };
    }

    /**
     * 处理鼠标下移
     */
    handleMouseDown() {
        const {isActive, dispatch, duration} = this.props;
        if (!isActive) {
            return;
        }

        const {seekPercent} = this.state;
        const audioElement = document.getElementById('audio');
        if (!audioElement) {
            return;
        }

        const currentTime = Math.floor(seekPercent * (duration / 1000));
        audioElement.currentTime = currentTime;
        dispatch(changeCurrentTime(currentTime));
    }

    /**
     * 处理鼠标离开
     * @param e
     */
    handleMouseMove(e) {
        const {isActive} = this.props;
        if (!isActive) {
            return;
        }
        const seekPercent = (e.clientX - offsetLeft(e.currentTarget)) / e.currentTarget.offsetWidth;
        this.setState({seekPercent});
    }

    /**
     * 处理鼠标移出
     */
    handleMouseLeave() {
        this.setState({seekPercent: 0});
    }

    /**
     * 渲染可点击
     * @returns {*}
     */
    renderClickable() {
        const {isActive, playSong} = this.props;
        const seekPercent = this.state.seekPercent * 100;
        if (!isActive) {
            return (
                <div>
                    <div className="waveform-play-highlight"/>
                    <div
                        className="waveform-play-highlight-icon"
                        onClick={playSong}
                    >
                        <i className="icon ion-ios-play"/>
                    </div>
                </div>
            );
        }

        if (seekPercent) {
            return (
                <div>
                    <div className="waveform-seek-line" style={{width: `${seekPercent}%`}}/>
                    <div className="waveform-seek-bar" style={{width: `${seekPercent}%`}}/>
                </div>
            );
        }

        return null;
    }

    /**
     * 渲染图片
     * @returns {*}
     */
    renderImage() {
        const {waveformUrl} = this.props;
        if (waveformUrl.indexOf('json') > -1) {
            return null;
        }

        return (
            <img
                alt="song waveform"
                className="waveform-image"
                src={waveformUrl.replace('http:', '')}
            />
        );
    }

    /**
     * 渲染波浪表单
     * @returns {XML}
     */
    renderWaveform() {
        const {currentTime, duration, isActive} = this.props;
        const width = isActive ? currentTime / (duration / 1000) * 100 : 0;
        return (
            <div
                className="waveform-image-container"
                onMouseDown={this.handleMouseDown}
                onMouseLeave={this.handleMouseLeave}
                onMouseMove={this.handleMouseMove}
            >
                {this.renderImage()}
                <div className="waveform-image-bg" style={{width: `${width}%`}}/>
                {this.renderClickable()}
            </div>
        );
    }

    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        return (
            <div className="waveform">
                <canvas className="waveform-canvas" ref="canvas"></canvas>
                {this.renderWaveform()}
            </div>
        );
    }
}

Waveform.propTypes = propTypes;

export default Waveform;
