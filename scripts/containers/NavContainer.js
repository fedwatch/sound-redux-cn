import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import MobileNav from '../components/MobileNav';
import Nav from '../components/Nav';

const propTypes = {
    isMobile: PropTypes.bool,
};

/**
 * 导航容器
 */
class NavContainer extends Component {
    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        const {isMobile} = this.props;
        if (isMobile) {
            return <MobileNav {...this.props} />;
        }

        return <Nav {...this.props} />;
    }
}

/**
 * 映射状态到属性
 * @param state
 * @returns {{authed: *, authedPlaylists: *, isMobile: *, navigator: *, songs: *}}
 */
function mapStateToProps(state) {
    const {authed, entities, environment, navigator} = state;
    const {playlists, songs} = entities;
    const {isMobile} = environment;

    return {
        authed,
        authedPlaylists: playlists,
        isMobile,
        navigator,
        songs,
    };
}

NavContainer.propTypes = propTypes;

export default connect(mapStateToProps)(NavContainer);
