import rootReducer from './reducers';
import {createStore} from 'redux';

// TODO: load initial settings state from local cache
const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;