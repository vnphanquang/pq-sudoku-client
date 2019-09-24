import React from 'react';
import {connect, batch} from 'react-redux';

import { 
  ThemeReplacement,
} from '../../redux/actions';
import { SudokuAddition } from '../../redux/actions/sudokus';
import {  
  DialogAction,
  DIALOG_CANCEL,
  DIALOG_ADD_TAB, 
  DIALOG_EXPORT, 
  DIALOG_SAVEAS,
  DIALOG_OPEN,
  DIALOG_SETTINGS,
  DIALOG_FEEDBACK,
  DIALOG_ABOUT,
  DIALOG_HELP,
} from '../../redux/actions/dialogs';

import AddTabDialog from './AddTabDialog';
import ExportDialog from './ExportDialog';
import SaveAsDialog from './SaveAsDialog';
import OpenDialog from './OpenDialog';
import SettingsDialog from './SettingsDialog';
import AboutDialog from './AboutDialog';
import FeedbackDialog from './FeedbackDialog';

const dialogVariants = {
  [DIALOG_ADD_TAB]: AddTabDialog,
  [DIALOG_EXPORT]: ExportDialog,
  [DIALOG_SAVEAS]: SaveAsDialog,
  [DIALOG_OPEN]: OpenDialog,
  [DIALOG_SETTINGS]: SettingsDialog,
  [DIALOG_ABOUT]: AboutDialog,
  [DIALOG_FEEDBACK]: FeedbackDialog,
}

const submitVariants = {
  [DIALOG_ADD_TAB]: (thisArg) => thisArg.props.addTab.bind(thisArg),
  [DIALOG_EXPORT]: (thisArg) => thisArg.exportFile.bind(thisArg),
  [DIALOG_SAVEAS]: (thisArg) => thisArg.exportFile.bind(thisArg),
  [DIALOG_OPEN]: (thisArg) => thisArg.openSudoku.bind(thisArg),
  [DIALOG_SETTINGS]: (thisArg) => thisArg.applySettings.bind(thisArg),
  [DIALOG_FEEDBACK]: (thisArg) => thisArg.sendFeedback.bind(thisArg),
  [DIALOG_ABOUT]: () => null,
}

class DialogPQS extends React.PureComponent {

  constructor(props) {
    super(props)
    this.aRef = null;
    this.updateARef = this.updateARef.bind(this);
  }
  
  updateARef(node) {
    this.aRef = node;
  }

  exportFile(name, format, url) {
    this.aRef.href = url;
    this.aRef.download = `${name}.${format}`;
    this.aRef.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    this.props.cancelDialog();
  }

  openSudoku(name, sudokuData) {
    batch(() => {
      this.props.cancelDialog();
      this.props.addTab({name, ...sudokuData});
    })
  }

  applySettings(type, settings) {
    switch(type) {
      case 'theme':
        this.props.replaceTheme(settings.theme);
        break;
      default:
        break
    }
  }

  sendFeedback(data) {
    console.log(data);
  }

  render() {
    console.log('Dialog rendered')
    const {type, data, cancelDialog} = this.props;
    const Dialog = dialogVariants[type];
    
    return (
      <React.Fragment>
        { 
          Dialog && 
          <Dialog 
            onSubmit={submitVariants[type](this)}
            onCancel={cancelDialog}
            data={data}
          />
        }
        <a 
          style={{display: 'none'}}
          href="/"
          ref={this.updateARef}
        >
          (hidden)Export
        </a>
      </React.Fragment>
    )
  }
}


const mapStateToProps = state => {
  const type = state.dialog;
  let data = null;
  switch (type) {
    case DIALOG_SAVEAS:
    case DIALOG_EXPORT:
      const activeIndex = state.sudokus.activeIndex
      if ((activeIndex || activeIndex === 0) && true) {
        data = state.sudokus.array[activeIndex];
      }
      break;
    case DIALOG_SETTINGS:
      data = {theme: state.theme};
      break;
    default:
      break;
  }
  return {
    type,
    data
  }
}

const mapDispatchToProps = dispatch => ({
  cancelDialog: () => dispatch(DialogAction(DIALOG_CANCEL)),
  addTab: (config) => batch(() => {
    dispatch(DialogAction(DIALOG_CANCEL));
    dispatch(SudokuAddition(config));
  }),
  replaceTheme: (theme) => batch(() => {
    dispatch(DialogAction(DIALOG_CANCEL));
    dispatch(ThemeReplacement(theme));
  }),
})

export default connect(mapStateToProps, mapDispatchToProps)(DialogPQS);
