import React, { useCallback, useState } from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { DrawerToggle, TabChange, TabRemoval } from '../redux/actions'

import { makeStyles } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ArrowUp from '@material-ui/icons/KeyboardArrowUp';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import GridIcon from '@material-ui/icons/GridOn';

import { APPBAR_HEIGHT } from './utils'

function SudokuAppBar() {
  // console.log('DrawerIcon rendered');
  const classes = useStyles();
  return (
    <AppBar className={classes.root}>
      <Toolbar disableGutters>
        <DrawerIcon className={classes.drawerBtn} />
        <Typography variant="h5" className={classes.brand}>
          Sudoku PQ
        </Typography>
        <SudokuTabs />
      </Toolbar>
    </AppBar>
  )
}


function SudokuTabs() {
  console.log('Sudoku Tabs rendered');

  const classes = useStyles();

  const tabs = useSelector(state => state.tabs);
  const dispatch = useDispatch();

  const changeTab = (e, index) => index !== tabs.activeIndex && dispatch(TabChange(index)); 

  //TODO: confirmation message && autosave?
  //TODO: implement removeTab at inactive indices
  const removeTab = useCallback(
    (e, index) => dispatch(TabRemoval(index)),
    [dispatch]
  )

  return (
    <Tabs
      value={tabs.activeIndex !== null ? tabs.activeIndex : false}
      onChange={changeTab}
      variant="scrollable"
      className={classes.tabs}
      scrollButtons="on"
      aria-label="sudoku tabs"
    >
      {tabs.array.map(({name, id}, index) => (
        <SudokuTab 
          key={`sudoku-tab-${id}`}
          index={index} 
          name={name} 
          onClick={removeTab} 
        />  
      ))}
    </Tabs>
  )
}

function SudokuTab({ name, onClick, index, selected, ...others }) {
  const classes = useStyles();
  //TODO: shrinks and expand tab names according to view width??
  return (
    <Tab
    {...others}
    selected={selected}
    value={index}
    className={selected ? classes.tabSelected : classes.tab}
      label={(
        <div>
          <Typography variant="button" display="inline">
            {`${name.substring(0, 8)}...`}
          </Typography>
          { selected &&
            <IconButton component='div' onClick={(e) => onClick(e, index)} className={classes.tabCloseBtn}>
              <CloseIcon />
            </IconButton>
          }
        </div>
      )}
    />
  )
}

function DrawerIcon(props) {
  const drawerOpen = useSelector(state => state.navigation.drawerOpen);
  const dispatch = useDispatch();
  const toggleDrawer = useCallback(
    () => dispatch(DrawerToggle()),
    [dispatch]
  );

  return (
    <IconButton
      aria-label="Toggle drawer"
      onClick={toggleDrawer}
      {...props}
    >
      {drawerOpen ? <ArrowUp /> : <MenuIcon />}
    </IconButton>
  )
}

const useStyles = makeStyles(theme => ({
  tabs: {
    marginLeft: '20px',
    // alignItems: 'end'
  },
  tab: {

  },
  tabSelected: {
    // backgroundColor: 'white'
  },
  tabCloseBtn: {
    padding: 0,
    marginTop: 12,
    marginBottom: 12,
    marginLeft: 12
  },

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

export default React.memo(SudokuAppBar);
