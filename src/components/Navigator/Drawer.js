import React from 'react';
import clsx from 'clsx';

import {withStyles} from '@material-ui/styles';
import {
  Drawer,
  Backdrop,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import {
  AddCircle as AddIcon,
  FolderOpen as FolderOpenIcon,
  Save as SaveIcon,
  SaveAlt as SaveAltIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Info as InfoIcon,
  Feedback as FeedbackIcon,
  CloudDownload as CloudDownloadIcon,
} from '@material-ui/icons';


import {EXPANDED_DRAWER_WIDTH, COLLAPSED_DRAWER_WIDTH, APPBAR_HEIGHT} from '../utils';
import {drawerLabels} from '../../lang.js';

import {
  // DialogAction,
  DIALOG_ADD_TAB, 
  DIALOG_OPEN,
  DIALOG_SAVEAS,
  DIALOG_EXPORT, 
  DIALOG_SETTINGS,
  DIALOG_FEEDBACK,
  DIALOG_HELP,
  DIALOG_ABOUT,
} from '../../redux/actions/dialogs';

class DrawerPQS extends React.PureComponent {
  // constructor(props) {
  //   super(props);
  // }
  
  render() {
    // console.log('Drawer rendered');
    const {classes, drawerOpen, dispatchDialog, saveCurrentSudoku, toggleDrawer, sudokuActive} = this.props;
    return (
      <React.Fragment>
        <Drawer
          classes={{paper: clsx(classes.drawerPaper, !drawerOpen && classes.drawerPaperClose)}}
          variant="permanent"
          open={drawerOpen}
        >
          <List>
            <ListItem 
              className={classes.drawerItem} 
              button 
              onClick={() => dispatchDialog(DIALOG_ADD_TAB, drawerOpen)}
            >
              <ListItemIcon><AddIcon /></ListItemIcon>
              <ListItemText primary={drawerLabels.new + '...'} />
            </ListItem>
            <ListItem 
              button 
              className={classes.drawerItem}
              onClick={() => dispatchDialog(DIALOG_OPEN, drawerOpen)}
            >
              <ListItemIcon><FolderOpenIcon /></ListItemIcon>
              <ListItemText primary={drawerLabels.open + '...'} />
            </ListItem>
            <ListItem 
              button 
              className={classes.drawerItem} 
              onClick={() => saveCurrentSudoku(drawerOpen)}
              disabled={!sudokuActive}
            >
              <ListItemIcon><SaveIcon /></ListItemIcon>
              <ListItemText primary={drawerLabels.save} />
            </ListItem>
            <ListItem 
              button 
              className={classes.drawerItem} 
              onClick={() => dispatchDialog(DIALOG_SAVEAS, drawerOpen)}
              disabled={!sudokuActive}
            >
              <ListItemIcon><SaveAltIcon /></ListItemIcon>
              <ListItemText primary={drawerLabels.saveAs + '...'} />
            </ListItem>
            <ListItem 
              button 
              className={classes.drawerItem} 
              onClick={() => dispatchDialog(DIALOG_EXPORT, drawerOpen)}
              disabled={!sudokuActive}
            >
              <ListItemIcon><CloudDownloadIcon /></ListItemIcon>
              <ListItemText primary={drawerLabels.export + '...'} />
            </ListItem>
            <ListItem 
              button 
              className={classes.drawerItem} 
              onClick={() => dispatchDialog(DIALOG_SETTINGS, drawerOpen)}
            >
              <ListItemIcon><SettingsIcon /></ListItemIcon>
              <ListItemText primary={drawerLabels.settings}/>
            </ListItem>
            
            <Divider />

            <ListItem 
              button 
              className={classes.drawerItem} 
              onClick={() => dispatchDialog(DIALOG_FEEDBACK, drawerOpen)}
            >
              <ListItemIcon><FeedbackIcon /></ListItemIcon>
              <ListItemText primary={drawerLabels.feedback} />
            </ListItem>
            <ListItem 
              button 
              className={classes.drawerItem} 
              onClick={() => dispatchDialog(DIALOG_HELP, drawerOpen)}
            >
              <ListItemIcon><HelpIcon /></ListItemIcon>
              <ListItemText primary={drawerLabels.help} />
            </ListItem>
            <ListItem 
              button 
              className={classes.drawerItem} 
              onClick={() => dispatchDialog(DIALOG_ABOUT, drawerOpen)}
            >
              <ListItemIcon><InfoIcon /></ListItemIcon>
              <ListItemText primary={drawerLabels.about} />
            </ListItem>
          </List>
        </Drawer >
        <Backdrop
          open={drawerOpen}
          onClick={toggleDrawer}
          className={classes.drawerBackdrop}
        />
      </React.Fragment>
    )
  }
}

const styles = theme => ({
  drawerPaper: {
    marginTop: APPBAR_HEIGHT,
    width: EXPANDED_DRAWER_WIDTH,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },

  drawerPaperClose: {
    width: 0,
    overflowX: 'hidden',
    [theme.breakpoints.up('md')]: {
      width: COLLAPSED_DRAWER_WIDTH,
    },
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },

  drawerItem: {
    padding: '16px 20px',
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
  
  drawerBackdrop: {
    zIndex: `${theme.zIndex.drawer - 1} !important`,
  },
})


export default withStyles(styles)(DrawerPQS);
