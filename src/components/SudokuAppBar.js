import React, {useCallback, useEffect} from 'react';
import clsx from 'clsx';
import {useSelector, useDispatch} from 'react-redux';
import {DrawerToggle} from '../redux/actions'

import {makeStyles} from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowUp from '@material-ui/icons/KeyboardArrowUp';
import MenuIcon from '@material-ui/icons/Menu';

import {APPBAR_HEIGHT} from './utils'

function SudokuAppBar() {
  const classes = useStyles();
  return (
    <AppBar className={classes.root}>
      <Toolbar disableGutters>
        <DrawerIcon className={classes.drawerBtn} />
        <Typography variant="h5" className={classes.brand}>
          Sudoku PQ
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

function DrawerIcon(props) {
  const drawerOpen = useSelector(state => state.drawerOpen);
  const dispatch = useDispatch();
  const toggleDrawer = useCallback(
    () => dispatch(DrawerToggle()),
    [dispatch]
  );

  useEffect(() => {
    console.log('DrawerIcon rendered');
  })

  return (
    <IconButton
      aria-label="Toggle drawer"
      onClick={toggleDrawer}
      {...props}
    >
      {drawerOpen ? <ArrowUp/> : <MenuIcon/>}
    </IconButton>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: theme.zIndex.drawer,
    height: APPBAR_HEIGHT
  },
  brand: {
    whiteSpace: 'nowrap'
  },
  drawerBtn: {
    marginLeft: 12,
    marginRight: 12
  },
}))

export default SudokuAppBar;
