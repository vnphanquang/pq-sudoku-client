import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {DialogCancellation, DIALOG_ADD_TAB, DIALOG_REMOVE_TAB, DIALOG_EXPORT, TabAddition, TabRemoval, SudokuExport} from '../../redux/actions';

import AddTabDialog from './AddTabDialog';
import ExportDialog from './ExportDialog';

function SudokuDialog() {
  console.log('SudokuDialog rendered');
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
  
  switch (dialogType) {
    case DIALOG_ADD_TAB:
      return (
        <AddTabDialog onSubmit={addTab} onCancel={cancel}/>
      )
    // case DIALOG_REMOVE_TAB:
    //   return <TabRemovalDialog onSubmit={addTab}/>
    case DIALOG_EXPORT:
      //FIME: if no active sudoku ==> deny and give message -> user
      return (
        <ExportDialog 
          onCancel={cancel} 
          sudoku={sudoku}
        />
      )
    default:
      return null;
  }
}

export default SudokuDialog
