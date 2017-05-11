import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/index';

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);

/**
 * 配置Store
 * @param initialState
 * @returns {Store<S>}
 */
export default function configureStore(initialState) {
    const store = createStoreWithMiddleware(rootReducer, initialState);
    console.log(store.getState())
    return store;
}
