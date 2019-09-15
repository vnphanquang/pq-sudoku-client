import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { 
  DialogCancellation, 
  DIALOG_ADD_TAB, 
  DIALOG_EXPORT, 
  DIALOG_SAVEAS,
  DIALOG_OPEN,
  TabAddition,
  SnackbarNoSudoku
} from '../../redux/actions';

import AddTabDialog from './AddTabDialog';
import ExportDialog from './ExportDialog';
import SaveAsDialog from './SaveAsDialog';
import OpenDialog from './OpenDialog';

function SudokuDialog() {
  // console.log('SudokuDialog rendered');
  const aRef = React.useRef(null);

  // const dialogType = useSelector(state => state.dialog);
  // const sudoku= useSelector(state => state.dialog !== null && state.tabs.array[state.tabs.activeIndex]);
  const {dialogType, sudoku} = useSelector(state => ({
    dialogType: state.dialog,
    sudoku: (state.dialog !== null && state.tabs.activeIndex !== null) && state.tabs.array[state.tabs.activeIndex]
  }))
  const dispatch = useDispatch();

  const addTab = React.useCallback(
    (name) => dispatch(TabAddition({name})),
    [dispatch]
  )

  const cancel = React.useCallback(
    () => dispatch(DialogCancellation()),
    [dispatch],
  )
  
  const exportFile = React.useCallback(
    (name, format, url) => {
      aRef.current.href = url;
      aRef.current.download = `${name}.${format}`;
      aRef.current.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    },
    [aRef]
  )

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
      if (!sudoku) {
        dispatch(SnackbarNoSudoku());
        dialog = null;
      } else {
        dialog = (
          <ExportDialog 
            onSubmit={exportFile}
            onCancel={cancel} 
            sudoku={sudoku}
          />
        )
      }
      break;
    case DIALOG_SAVEAS:
      if (!sudoku) {
        dispatch(SnackbarNoSudoku());
        dialog = null;
      } else {
        dialog = (
          <SaveAsDialog 
            onSubmit={exportFile}
            onCancel={cancel}
            sudoku={sudoku}
          />
        )
      }
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
