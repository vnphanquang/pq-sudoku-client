import React from 'react';
import clsx from 'clsx';

import {withStyles} from '@material-ui/styles';
import {
  Drawer,
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
} from '@material-ui/icons';


import {EXPANDED_DRAWER_WIDTH, COLLAPSED_DRAWER_WIDTH, APPBAR_HEIGHT} from '../utils';
import {drawerLabels} from '../../lang.js';

// import {connect} from 'react-redux';
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
    console.log('Drawer rendered');
    const {classes, drawerOpen, dispatchDialog, sudokuActive} = this.props;
    return (
      <Drawer
        variant="permanent"
        open={drawerOpen}
        // onClose={toggleDrawer}
        classes={{paper: clsx(classes.drawerPaper, !drawerOpen && classes.drawerPaperClose)}}
      >
        <List>
          <ListItem 
            className={classes.drawerItem} 
            button 
            onClick={() => dispatchDialog(DIALOG_ADD_TAB)}
          >
            <ListItemIcon><AddIcon /></ListItemIcon>
            <ListItemText primary={drawerLabels.new + '...'} />
          </ListItem>
          <ListItem 
            button 
            className={classes.drawerItem}
            onClick={() => dispatchDialog(DIALOG_OPEN)}
          >
            <ListItemIcon><FolderOpenIcon /></ListItemIcon>
            <ListItemText primary={drawerLabels.open + '...'} />
          </ListItem>
          <ListItem 
            button 
            className={classes.drawerItem} 
            onClick={() => dispatchDialog(DIALOG_SAVEAS)}
            disabled={!sudokuActive}
          >
            <ListItemIcon><SaveIcon /></ListItemIcon>
            <ListItemText primary={drawerLabels.saveAs + '...'} />
          </ListItem>
          <ListItem 
            button 
            className={classes.drawerItem} 
            onClick={() => dispatchDialog(DIALOG_EXPORT)}
            disabled={!sudokuActive}
          >
            <ListItemIcon><SaveAltIcon /></ListItemIcon>
            <ListItemText primary={drawerLabels.export + '...'} />
          </ListItem>
          <ListItem 
            button 
            className={classes.drawerItem} 
            onClick={() => dispatchDialog(DIALOG_SETTINGS)}
          >
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary={drawerLabels.settings}/>
          </ListItem>
          
          <Divider />

          <ListItem 
            button 
            className={classes.drawerItem} 
            onClick={() => dispatchDialog(DIALOG_FEEDBACK)}
          >
            <ListItemIcon><FeedbackIcon /></ListItemIcon>
            <ListItemText primary={drawerLabels.feedback} />
          </ListItem>
          <ListItem 
            button 
            className={classes.drawerItem} 
            onClick={() => dispatchDialog(DIALOG_HELP)}
          >
            <ListItemIcon><HelpIcon /></ListItemIcon>
            <ListItemText primary={drawerLabels.help} />
          </ListItem>
          <ListItem 
            button 
            className={classes.drawerItem} 
            onClick={() => dispatchDialog(DIALOG_ABOUT)}
          >
            <ListItemIcon><InfoIcon /></ListItemIcon>
            <ListItemText primary={drawerLabels.about} />
          </ListItem>
        </List>
      </Drawer>
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
})


// const mapStateToProps = (state) => ({
//   drawerOpen: state.navigation.drawerOpen,
//   isActive: (state.tabs.activeIndex || state.tabs.activeIndex === 0) && true
// })

// const mapDispatchToProps = (dispatch) => ({
//   dispatchDialog: (type) => dispatch(Dialog(type))
// })

// export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DrawerPQS));

export default withStyles(styles)(DrawerPQS);
