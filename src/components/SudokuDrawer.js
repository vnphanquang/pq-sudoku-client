import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {DrawerToggle, DialogTabAddition} from '../redux/actions';

import clsx from 'clsx';

import {makeStyles} from '@material-ui/styles';

import {EXPANDED_DRAWER_WIDTH, COLLAPSED_DRAWER_WIDTH, APPBAR_HEIGHT} from './utils';
import {DRAWER_LABELS} from '../lang.js';

import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link';

import AddIcon from '@material-ui/icons/AddCircle';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import SaveIcon from '@material-ui/icons/Save';
import SaveAltIcon from '@material-ui/icons/SaveAlt'
import SettingsIcon from '@material-ui/icons/Settings';
import HelpIcon from '@material-ui/icons/Help';
import InfoIcon from '@material-ui/icons/Info';
import FeedbackIcon from '@material-ui/icons/Feedback';
import SourceIcon from '@material-ui/icons/Code';

function SudokuDrawer() {
  // console.log('SudokuDrawer rendered');

  const classes = useStyles();
  const drawerOpen = useSelector(state => state.navigation.drawerOpen);
  const dispatch = useDispatch();
  
  const toggleDrawer = React.useCallback(
    () => dispatch(DrawerToggle()),
    [dispatch]
  );

  const dialogAddTab = React.useCallback(
    () => dispatch(DialogTabAddition()),
    [dispatch]
  )

  return (
    <Drawer
      variant="permanent"
      open={drawerOpen}
      onClose={toggleDrawer}
      classes={{paper: clsx(classes.drawerPaper, !drawerOpen && classes.drawerPaperClose)}}
    >
      <List>
        <ListItem button className={classes.drawerItem} onClick={dialogAddTab}>
          <ListItemIcon><AddIcon /></ListItemIcon>
          <ListItemText primary={DRAWER_LABELS.NEW} />
        </ListItem>
        <ListItem button className={classes.drawerItem}>
          <ListItemIcon><SaveIcon /></ListItemIcon>
          <ListItemText primary={DRAWER_LABELS.SAVE} />
        </ListItem>
        <ListItem button className={classes.drawerItem}>
          <ListItemIcon><FolderOpenIcon /></ListItemIcon>
          <ListItemText primary={DRAWER_LABELS.LOAD} />
        </ListItem>
        <ListItem button className={classes.drawerItem}>
          <ListItemIcon><SaveAltIcon /></ListItemIcon>
          <ListItemText primary={DRAWER_LABELS.EXPORT} />
        </ListItem>
        <ListItem button className={classes.drawerItem}>
          <ListItemIcon><SettingsIcon /></ListItemIcon>
          <ListItemText primary={DRAWER_LABELS.SETTINGS} />
        </ListItem>
        <Divider />
        <ListItem button className={classes.drawerItem}>
          <ListItemIcon><FeedbackIcon /></ListItemIcon>
          <ListItemText primary={DRAWER_LABELS.FEEDBACK} />
        </ListItem>
        <ListItem button className={classes.drawerItem}>
          <ListItemIcon><HelpIcon /></ListItemIcon>
          <ListItemText primary={DRAWER_LABELS.HELP} />
        </ListItem>
        <ListItem button className={classes.drawerItem}>
          <ListItemIcon><InfoIcon /></ListItemIcon>
          <ListItemText primary={DRAWER_LABELS.ABOUT} />
        </ListItem>
        <Link
          color="inherit"
          href="https://github.com/vnphanquang/pq-sudoku"
          target="_blank"
          underline="none"
        >
          <ListItem button className={classes.drawerItem}>
            <ListItemIcon><SourceIcon /></ListItemIcon>
            <ListItemText primary={DRAWER_LABELS.SOURCE} />
          </ListItem>
        </Link>
      </List>
    </Drawer>
  )
}

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    marginTop: APPBAR_HEIGHT,
    width: EXPANDED_DRAWER_WIDTH,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },

  drawerPaperClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: COLLAPSED_DRAWER_WIDTH,
    overflowX: 'hidden',
  },

  drawerItem: {
    padding: '21px 16px 21px 20px'
  },

  drawerModal: {
    zIndex: `${theme.zIndex.drawer - 1} !important`,
  },

  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    ...theme.mixins.toolbar,
  },

  drawerBtn: {
    marginLeft: 12,
    marginRight: 12,
  },
}))

export default React.memo(SudokuDrawer);
