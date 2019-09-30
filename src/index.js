import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import AppContainer from './components/AppContainer';
import store from './redux/store'
import * as serviceWorker from './serviceWorker';
import { SudokuSave} from './redux/actions/sudokus';

const rootNode = document.getElementById('root');

//TODO: Handle synchronization across multiple tabs => ServiceWorker??
window.onbeforeunload = (e) => {
  e.preventDefault();
  if (store.getState().sudokus.activeIndex !== null) {
    store.dispatch(SudokuSave());
  }
  const stateJSON = JSON.stringify(store.getState());
  window.localStorage.setItem('state', stateJSON);
  e.returnValue = '';
  // delete e['returnValue'];
}
ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  rootNode
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
