import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import AppContainer from './components/AppContainer';
import store from './redux/store'
import * as serviceWorker from './serviceWorker';
import AlreadyOpenDialog from './components/Dialog/AlreadyOpenDialog';
import { SudokuSave} from './redux/actions/sudokus';

const rootNode = document.getElementById('root');

try {
  if (!(window.localStorage.open === 'true')) {
    window.localStorage.setItem('open', 'true');
    window.addEventListener('beforeunload', (e) => {
      e.preventDefault();
      store.dispatch(SudokuSave());
      const stateJSON = JSON.stringify(store.getState());
      window.localStorage.setItem('state', stateJSON);
      window.localStorage.removeItem('open');
      delete e['returnValue'];
    })
    ReactDOM.render(
      <Provider store={store}>
        <AppContainer />
      </Provider>,
      rootNode
    )
  } else {
    ReactDOM.render(
      <AlreadyOpenDialog/>,
      rootNode
    )
  }
} catch (err) {
  console.log(err);
}



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
