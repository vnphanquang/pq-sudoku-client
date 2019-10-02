import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import App from './components/App';
import store from './redux/store'
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
  // delete e['returnValue'];
  e.returnValue = '';
}
ReactDOM.render(
  <Provider store={store}>
    <App new={store.getState().sudokus.activeIndex === null}/>
  </Provider>,
  rootNode
);
