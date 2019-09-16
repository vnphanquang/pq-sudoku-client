import React from 'react';
import {connect} from 'react-redux';

import { 
  TabAddition,
} from '../../redux/actions';

import {  
  Dialog,
  DIALOG_CANCEL,
  DIALOG_ADD_TAB, 
  DIALOG_EXPORT, 
  DIALOG_SAVEAS,
  DIALOG_OPEN,
} from '../../redux/actions/dialogs';

import AddTabDialog from './AddTabDialog';
import ExportDialog from './ExportDialog';
import SaveAsDialog from './SaveAsDialog';
import OpenDialog from './OpenDialog';

const dialogVariants = {
  [DIALOG_ADD_TAB]: AddTabDialog,
  [DIALOG_EXPORT]: ExportDialog,
  [DIALOG_SAVEAS]: SaveAsDialog,
  [DIALOG_OPEN]: OpenDialog,
}

const submitVariants = {
  [DIALOG_ADD_TAB]: (thisArg) => thisArg.props.addTab.bind(thisArg),
  [DIALOG_EXPORT]: (thisArg) => thisArg.exportFile.bind(thisArg),
  [DIALOG_SAVEAS]: (thisArg) => thisArg.exportFile.bind(thisArg),
  [DIALOG_OPEN]: (thisArg) => thisArg.openSudoku.bind(thisArg),
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

  render() {
    // console.log('Dialog rendered')
    const {type, sudoku, cancel} = this.props;
    const Dialog = dialogVariants[type];
    
    return (
      <React.Fragment>
        { 
          Dialog && 
          <Dialog 
            onSubmit={submitVariants[type](this)}
            onCancel={cancel}
            sudoku={sudoku}
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


const mapStateToProps = state => ({
  type: state.dialog,
  sudoku: (state.dialog !== null && state.tabs.activeIndex !== null) && state.tabs.array[state.tabs.activeIndex]
})

const mapDispatchToProps = dispatch => ({
  cancel: () => dispatch(Dialog(DIALOG_CANCEL)),
  addTab: (name) => dispatch(TabAddition({name})),

})

export default connect(mapStateToProps, mapDispatchToProps)(DialogPQS);
