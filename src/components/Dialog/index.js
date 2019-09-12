import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {DialogCancellation, DIALOG_ADD_TAB, DIALOG_REMOVE_TAB, TabAddition, TabRemoval} from '../../redux/actions';

import TabAdditionDialog from './TabAdditionDialog';

function SudokuDialog() {
  // console.log('SudokuDialog rendered');
  const dialogType = useSelector(state => state.dialog);
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
      return <TabAdditionDialog onSubmit={addTab} onCancel={cancel}/>
    // case DIALOG_REMOVE_TAB:
    //   return <TabRemovalDialog onSubmit={addTab}/>
    default:
      return null;
  }
}

export default SudokuDialog
