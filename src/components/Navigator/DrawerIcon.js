import React from 'react';
// import {DrawerToggle} from '../../redux/actions';
// import {useSelector, useDispatch, shallowEqual} from 'react-redux';

import IconButton from '@material-ui/core/IconButton';
import {
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Menu as MenuIcon,
} from '@material-ui/icons/';

function DrawerIcon({drawerOpen, onClick, ...others}) {
  console.log('DrawerIcon rendered');
  // const drawerOpen = useSelector(state => state.navigation.drawerOpen, shallowEqual);
  // const dispatch = useDispatch();
  // const toggleDrawer = React.useCallback(
  //   () => dispatch(DrawerToggle()),
  //   [dispatch]
  // );

  return (
    <IconButton
      aria-label="Toggle drawer"
      onClick={onClick}
      {...others}
    >
      {drawerOpen ? <KeyboardArrowUpIcon /> : <MenuIcon />}
    </IconButton>
  )
}

export default React.memo(DrawerIcon);