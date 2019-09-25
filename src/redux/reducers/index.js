import {combineReducers} from 'redux';

import dialog from './dialogs';
import sudokus from './sudokus';
import theme from './theme';
import general from './general';
import snackbar from './snackbar';

const rootReducer = combineReducers({
  theme,
  general,
  sudokus,
  dialog,
  snackbar,
})

export default rootReducer;