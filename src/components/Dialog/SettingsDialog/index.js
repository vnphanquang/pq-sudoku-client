import React from 'react';
import clsx from 'clsx';

import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  Drawer,
  IconButton,
  Slide,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';


import { dialogLabels } from '../../../lang';
import AppearancePanel from './AppearancePanel';

const SlideTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

function SettingsDialog({onSubmit, onCancel, data: {theme}}) {
  console.log('Settings Dialog rendered');
  const classes = useStyles();
  const [activePanel, setActivePanel] = React.useState(0);
  const [drawerOpen, setDrawerOpen] = React.useState(true);
  const appearanceRef = React.useRef(null);
  function changePanel(e, index) {
    setActivePanel(index);
  }

  function submitThemeReplacement(e) {
    onSubmit('theme', {
      theme: appearanceRef.current.state,
    })
  }

  //TODO: handle filling default settings
  function defaultTheme(e) {
    onSubmit('theme', {
      theme: null
    })
  }

  function toggleDrawer() {
    setDrawerOpen(!drawerOpen);
  }

  return (
    <Dialog
      className={classes.root}
      fullScreen
      open
      onClose={onCancel}
      TransitionComponent={SlideTransition}
    >
      <AppBar className={classes.appBar} position="relative">
        <Toolbar>
          <IconButton
            aria-label="Toggle drawer"
            onClick={toggleDrawer}
          >
            {drawerOpen ? <KeyboardArrowUpIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {dialogLabels.settings}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="persistent"
        open={drawerOpen}
      >
        <Tabs
          className={classes.tabLabels}
          orientation="vertical"
          variant="scrollable"
          value={activePanel}
          onChange={changePanel}
        >
          <Tab label="Appearance" />
        </Tabs>
      </Drawer>
      <div className={classes.content}>
        <div 
          className={clsx(classes.panels, drawerOpen ? classes.panelTransitionClose : classes.panelTransitionOpen)}
        >
          <AppearancePanel ref={appearanceRef} hidden={activePanel !== 0} index={0} theme={theme}>1</AppearancePanel>
        </div>
        <DialogActions className={classes.actions}>
          <Button onClick={defaultTheme}>{dialogLabels.default}</Button>
          <Button onClick={onCancel}>{dialogLabels.cancel}</Button>
          <Button onClick={submitThemeReplacement}>{dialogLabels.apply}</Button>
        </DialogActions>
      </div>
    </Dialog>
  )
}

const drawerWidth = 150;

const useStyles = makeStyles(theme => ({
  root: {
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  panels: {
    flexGrow: 1,
    padding: theme.spacing(0, 1),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  panelTransitionOpen: {
    transition: theme.transitions.create(['margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  panelTransitionClose: {
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  tabLabels: {
    width: drawerWidth,
    borderRight: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(10),
  },
  actions: {
    // justifySelf: 'end'
  },
  hidden: {
    display: 'none',
  }
}));

export default SettingsDialog;
