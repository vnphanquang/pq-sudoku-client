import React from 'react';
import {connect, batch} from 'react-redux';

import { ThemeSettings } from '../../redux/actions/theme';
import { GeneralSettings } from '../../redux/actions/general';
import { SaveAsPromptOnTabCloseToggle } from '../../redux/actions/general';
import { SudokuClose, CurrentSudokuSettings } from '../../redux/actions/sudokus'

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
  DIALOG_SAVEAS_ON_TAB_CLOSE,
} from '../../redux/actions/dialogs';

import AddTabDialog from './AddTabDialog';
import ExportDialog from './ExportDialog';
import SaveAsDialog from './SaveAsDialog';
import OpenDialog from './OpenDialog';
import SettingsDialog from './SettingsDialog';
import AboutDialog from './AboutDialog';
import FeedbackDialog from './FeedbackDialog';
import SaveAsOnTabCloseDialog from './SaveAsOnTabCloseDialog';

const dialogVariants = {
  [DIALOG_ADD_TAB]: AddTabDialog,
  [DIALOG_EXPORT]: ExportDialog,
  [DIALOG_SAVEAS]: SaveAsDialog,
  [DIALOG_OPEN]: OpenDialog,
  [DIALOG_SETTINGS]: SettingsDialog,
  [DIALOG_ABOUT]: AboutDialog,
  [DIALOG_FEEDBACK]: FeedbackDialog,
  [DIALOG_SAVEAS_ON_TAB_CLOSE]: SaveAsOnTabCloseDialog,
}

const actionVariants = {
  [DIALOG_ADD_TAB]: (thisArg) => ({
    onSubmit: thisArg.props.addSudoku,
  }),
  [DIALOG_EXPORT]: (thisArg) => ({
    onSubmit: thisArg.exportFile.bind(thisArg),
  }),
  [DIALOG_SAVEAS]: (thisArg) => ({
    onSubmit: thisArg.exportFile.bind(thisArg),
  }),
  [DIALOG_OPEN]: (thisArg) => ({
    onSubmit: thisArg.openSudoku.bind(thisArg),
  }),
  [DIALOG_SETTINGS]: (thisArg) => ({
    onApply: thisArg.props.applySettings,
    onApplyAllAndClose: thisArg.props.applyAllSettingsAndClose,
  }),
  [DIALOG_FEEDBACK]: (thisArg) => ({
    onSubmit: thisArg.sendFeedback.bind(thisArg),
  }),
  [DIALOG_SAVEAS_ON_TAB_CLOSE]: (thisArg) => ({
    onSave: () => thisArg.props.dispatchAnotherDialog(DIALOG_SAVEAS),
    onClose: () => thisArg.props.closeSudoku(thisArg.props.data),
    onToggleShowAgain: thisArg.props.toggleSaveAsPromptOnTabClose,
  }),
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
      this.props.addSudoku({name, ...sudokuData});
    })
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
            onCancel={cancelDialog}
            {...(actionVariants[type] && actionVariants[type](this))}
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
  const {type, payload} = state.dialog;
  let data = null;
  switch (type) {
    case DIALOG_SAVEAS:
    case DIALOG_EXPORT:
      const activeIndex = state.sudokus.activeIndex
      // if ((activeIndex || activeIndex === 0) && true) {
        if (activeIndex !== null) {
        data = state.sudokus.array[activeIndex];
      }
      break;
    case DIALOG_SETTINGS:
      data = {
        general: state.general,
        theme: state.theme,
        sudoku: state.sudokus.activeIndex !== null ? state.sudokus.array[state.sudokus.activeIndex] : null,
      };
      break;
    case DIALOG_SAVEAS_ON_TAB_CLOSE:
      data = payload;
      break;
    default:
      break;
  }
  return {
    type,
    data
  }
}

const settingsActionVariants = {
  theme: ThemeSettings,
  general: GeneralSettings,
  sudoku: CurrentSudokuSettings,
}

const mapDispatchToProps = dispatch => ({
  cancelDialog: () => dispatch(DialogAction(DIALOG_CANCEL)),
  addSudoku: (config) => batch(() => {
    dispatch(DialogAction(DIALOG_CANCEL));
    dispatch(SudokuAddition(config));
  }),
  closeSudoku: (index) => batch(() => {
    dispatch(DialogAction(DIALOG_CANCEL));
    dispatch(SudokuClose(index));
  }),
  applySettings: ({type, settings}) => dispatch(settingsActionVariants[type](settings)),
  applyAllSettingsAndClose: ({theme, general, sudoku}) => batch(() => {
    dispatch(DialogAction(DIALOG_CANCEL));
    dispatch(CurrentSudokuSettings(sudoku));
    dispatch(ThemeSettings(theme));
    dispatch(GeneralSettings(general));
  }),
  toggleSaveAsPromptOnTabClose: () => batch(() => {
    dispatch(DialogAction(DIALOG_CANCEL));
    dispatch(SaveAsPromptOnTabCloseToggle());
  }),
  dispatchAnotherDialog: (type) =>  batch(() => {
    dispatch(DialogAction(DIALOG_CANCEL));
    dispatch(DialogAction(type));
  }),
})

export default connect(mapStateToProps, mapDispatchToProps)(DialogPQS);
