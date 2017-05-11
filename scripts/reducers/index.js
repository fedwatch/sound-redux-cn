import {combineReducers} from 'redux';
import authed from '../reducers/authed';//授权认证
import entities from '../reducers/entities';//实体库
import environment from '../reducers/environment';//环境检测
import modal from '../reducers/modal';//模态框
import navigator from '../reducers/navigator';//导航
import player from '../reducers/player';//播放器
import playlists from '../reducers/playlists';//播放列表

const rootReducer = combineReducers({
    authed,
    entities,
    environment,
    modal,
    navigator,
    player,
    playlists,
});

export default rootReducer;
