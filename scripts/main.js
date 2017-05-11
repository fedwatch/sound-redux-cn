import 'babel-polyfill';
import 'fastclick';
import 'isomorphic-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import '../styles/main.scss';
import App from './containers/App';
import configureStore from './store/configureStore';

/**
 * 配置存储容器
 * @type {Store.<S>}
 */
const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('main')
);
