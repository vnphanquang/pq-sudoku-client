import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { 
  DialogCancellation, 
  DIALOG_ADD_TAB, 
  DIALOG_EXPORT, 
  DIALOG_SAVEAS,
  DIALOG_OPEN,
  TabAddition 
} from '../../redux/actions';

import AddTabDialog from './AddTabDialog';
import ExportDialog from './ExportDialog';
import SaveAsDialog from './SaveAsDialog';
import OpenDialog from './OpenDialog';

function SudokuDialog() {
  console.log('SudokuDialog rendered');
  const aRef = React.useRef(null);
  const dialogType = useSelector(state => state.dialog);
  const sudoku= useSelector(state => state.dialog !== null && state.tabs.array[state.tabs.activeIndex]);

  const dispatch = useDispatch();

  const addTab = React.useCallback(
    (name) => dispatch(TabAddition({name})),
    [dispatch]
  )

  const cancel = React.useCallback(
    () => dispatch(DialogCancellation()),
    [dispatch],
  )
  
  function exportFile(name, format, url) {
    aRef.current.href = url;
    aRef.current.download = `${name}.${format}`;
    aRef.current.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  function openSudoku(name, sudokuData) {
    const {cellValues} = sudokuData;
    window.sudoku = {
      ...window.sudoku,
      loadedValues: cellValues
    }
    addTab(name);
  }

  let dialog;
  switch (dialogType) {
    case DIALOG_ADD_TAB:
      dialog =  (
        <AddTabDialog onSubmit={addTab} onCancel={cancel}/>
      )
      break;
    // case DIALOG_REMOVE_TAB:
    //   return <TabRemovalDialog onSubmit={addTab}/>
    case DIALOG_EXPORT:
      //FIME: if no active sudoku ==> deny and give message -> user
      dialog = (
        <ExportDialog 
          onSubmit={exportFile}
          onCancel={cancel} 
          sudoku={sudoku}
        />
      )
      break;
    case DIALOG_SAVEAS:
      dialog = (
        <SaveAsDialog 
          onSubmit={exportFile}
          onCancel={cancel}
          sudoku={sudoku}
        />
      )
      break;
    case DIALOG_OPEN:
      dialog = (
        <OpenDialog 
          onSubmit={openSudoku}
          onCancel={cancel}
        />
      )
      break;
    default:
      dialog = null;
  }
  return (
    <React.Fragment>
      {dialog}
      <a 
        style={{display: 'none'}}
        href="/"
        ref={aRef}
      >
        (hidden)Export
      </a>
    </React.Fragment>
  )
}

export default SudokuDialog
