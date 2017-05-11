import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {initAuth} from '../actions/AuthedActions';
import {initEnvironment} from '../actions/EnvironmentActions';
import {initNavigator} from '../actions/NavigatorActions';

import NavContainer from '../containers/NavContainer';
import MeContainer from '../containers/MeContainer';
import ModalContainer from '../containers/ModalContainer';
import PlayerContainer from '../containers/PlayerContainer';
import SongContainer from '../containers/SongContainer';
import SongsContainer from '../containers/SongsContainer';
import UserContainer from '../containers/UserContainer';

/**
 * 属性验证
 * @type {{dispatch: *, height: (*), isMobile: *, path: *, width: (*)}}
 */
const propTypes = {
    dispatch: PropTypes.func.isRequired,
    height: PropTypes.number,
    isMobile: PropTypes.bool,
    path: PropTypes.array.isRequired,
    width: PropTypes.number,
};

/**
 *  应用入口容器
 */
class App extends Component {
    /**
     * 组件渲染完毕
     * @description 类似于window.onload
     */
    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(initEnvironment());
        dispatch(initAuth());
        dispatch(initNavigator());
    }

    /**
     * 渲染内容
     * @returns {*}
     */
    renderContent() {
        const {path} = this.props;
        switch (path[0]) {
            case 'songs':
                switch (path.length) {
                    case 1:
                        return <SongsContainer />;
                    case 2:
                        return <SongContainer />;
                    default:
                        return null;
                }
            case 'users':
                return <UserContainer />;
            case 'me':
                return <MeContainer />;
            default:
                return null;
        }
    }

    /**
     * 渲染
     * @returns {XML}
     */
    render() {
        const {height, isMobile, width} = this.props;
        if (isMobile) {
            return (
                <div className="mobile" style={{height: `${height}px`, width: `${width}px`}}>
                    <PlayerContainer />
                    {this.renderContent()}
                    <NavContainer />
                </div>
            );
        }

        return (
            <div>
                <NavContainer />
                {this.renderContent()}
                <PlayerContainer />
                <ModalContainer />
            </div>
        );
    }
}

App.propTypes = propTypes;

/**
 * 映射状态到属性
 * @param state
 * @returns {{height: *, isMobile: *, path: (*|*[]), width: *}}
 */
function mapStateToProps(state) {
    const {environment, navigator} = state;

    const {height, isMobile, width} = environment;
    const {path} = navigator.route;

    return {
        height,
        isMobile,
        path,
        width,
    };
}


export default connect(mapStateToProps)(App);
