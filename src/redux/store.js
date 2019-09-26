import rootReducer from './reducers';
import {createStore} from 'redux';

// TODO: load initial settings state from local cache
let store;
let initState = {};
try {
  if (window.localStorage.state) {
    initState = JSON.parse(window.localStorage.state);
  }
} catch(err) {
  console.log(err);
} finally {
  store = createStore(
    rootReducer,
    initState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
}

export default store;