import React from 'react';
import {DrawerToggle} from '../../redux/actions';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';

import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';

function DrawerIcon(props) {
  // console.log('DrawerIcon rendered');
  const drawerOpen = useSelector(state => state.navigation.drawerOpen, shallowEqual);
  const dispatch = useDispatch();
  const toggleDrawer = React.useCallback(
    () => dispatch(DrawerToggle()),
    [dispatch]
  );

  return (
    <IconButton
      aria-label="Toggle drawer"
      onClick={toggleDrawer}
      {...props}
    >
      {drawerOpen ? <KeyboardArrowUpIcon /> : <MenuIcon />}
    </IconButton>
  )
}

export default React.memo(DrawerIcon);