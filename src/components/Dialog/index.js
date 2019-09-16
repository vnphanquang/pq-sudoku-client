import React from 'react';
import {connect} from 'react-redux';

import { 
  TabAddition,
} from '../../redux/actions';

import {  
  DialogAction,
  DIALOG_CANCEL,
  DIALOG_ADD_TAB, 
  DIALOG_EXPORT, 
  DIALOG_SAVEAS,
  DIALOG_OPEN,
  DIALOG_SETTINGS,
} from '../../redux/actions/dialogs';

import AddTabDialog from './AddTabDialog';
import ExportDialog from './ExportDialog';
import SaveAsDialog from './SaveAsDialog';
import OpenDialog from './OpenDialog';
import SettingsDialog from './SettingsDialog';

const dialogVariants = {
  [DIALOG_ADD_TAB]: AddTabDialog,
  [DIALOG_EXPORT]: ExportDialog,
  [DIALOG_SAVEAS]: SaveAsDialog,
  [DIALOG_OPEN]: OpenDialog,
  [DIALOG_SETTINGS]: SettingsDialog,
}

const submitVariants = {
  [DIALOG_ADD_TAB]: (thisArg) => thisArg.props.addTab.bind(thisArg),
  [DIALOG_EXPORT]: (thisArg) => thisArg.exportFile.bind(thisArg),
  [DIALOG_SAVEAS]: (thisArg) => thisArg.exportFile.bind(thisArg),
  [DIALOG_OPEN]: (thisArg) => thisArg.openSudoku.bind(thisArg),
  [DIALOG_SETTINGS]: (thisArg) => thisArg.applySettings.bind(thisArg),
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
  }

  openSudoku(name, sudokuData) {
    const {cellValues} = sudokuData;
    window.sudoku = {
      ...window.sudoku,
      loadedValues: cellValues
    }
    this.props.addTab(name);
  }

  applySettings(settings) {
    console.log('Settings apply logic')
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
      const activeIndex = state.tabs.activeIndex
      if ((activeIndex || activeIndex === 0) && true) {
        data = state.tabs.array[activeIndex];
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
  addTab: (name) => dispatch(TabAddition({name})),

})

export default connect(mapStateToProps, mapDispatchToProps)(DialogPQS);
