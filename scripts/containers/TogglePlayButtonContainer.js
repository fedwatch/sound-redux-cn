import React, {Component} from 'react';
import {connect} from 'react-redux';
import TogglePlayButton from '../components/TogglePlayButton';

/**
 * 切换播放按钮容器
 */
class TogglePlayButtonContainer extends Component {
    render() {
        return <TogglePlayButton {...this.props} />;
    }
}

/**
 * 映射状态到属性
 * @param state
 * @returns {{isPlaying: *}}
 */
function mapStateToProps(state) {
    const {player} = state;
    const {isPlaying} = player;

    return {
        isPlaying,
    };
}

export default connect(mapStateToProps)(TogglePlayButtonContainer);
