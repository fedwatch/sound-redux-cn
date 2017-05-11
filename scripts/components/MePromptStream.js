import React, {Component, PropTypes} from 'react';
import {addNewStreamSongsToPlaylist} from '../actions/AuthedActions';

/**
 * 属性验证
 * @type {{authed: *, dispatch: *}}
 */
const propTypes = {
    authed: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
};

/**
 * Me提示框直播流
 */
class MePromptStream extends Component {
    /**
     * 构造器
     */
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
    }

    /**
     * 处理点击
     * @param e
     */
    handleClick(e) {
        const {dispatch} = this.props;
        e.preventDefault();
        dispatch(addNewStreamSongsToPlaylist());
    }

    /**
     * 渲染更新提示框
     * @returns {*}
     */
    renderUpdatesPrompt() {
        const {newStreamSongs} = this.props.authed;
        const newStreamSongsLen = newStreamSongs.length;
        if (newStreamSongsLen === 0) {
            return null;
        }

        return (
            <a className="me-prompt-link" href="#" onClick={this.handleClick}>
                {`Load ${newStreamSongsLen} new song${(newStreamSongsLen !== 1 ? 's' : '')}`}
            </a>
        );
    }

    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        return (
            <div className="me-prompt">
                {this.renderUpdatesPrompt()}
            </div>
        );
    }
}

MePromptStream.propTypes = propTypes;

export default MePromptStream;
