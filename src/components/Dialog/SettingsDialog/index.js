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
  Breadcrumbs,
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

import { InitState as generalInitState } from '../../../redux/actions/general';
import { InitState as themeInitState } from '../../../redux/actions/theme';
import { dialogLabels } from '../../../lang';
import ThemePanel from './ThemePanel';
import ConfirmationDialog from '../ConfirmationDialog';

const SlideTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

const defaultSettingsVariants = {
  general: generalInitState,
  theme: themeInitState,
}

const panelLabelVariants = {
  general: dialogLabels.general,
  theme: dialogLabels.appearance,
}

function SettingsDialog({onSubmit, onCancel, data}) {
  console.log('Settings Dialog rendered');
  const classes = useStyles();
  const [panelState, setPanelState] = React.useState({
    type: 'theme',
    defaultRequested: false,
    defaultApplied: false,
  })
  const [drawerOpen, setDrawerOpen] = React.useState(window.innerWidth >= 600);
  const panelRef = React.useRef(null);

  React.useEffect(
    () => {
      if (panelState.defaultApplied) {
        panelRef.current.setState(defaultSettingsVariants[panelState.type]);
        setPanelState({...panelState, defaultApplied: false})
      }
    },
    [panelState]
  )

  function changePanel(e, value) {
    setPanelState({
      ...panelState,
      type: value,
    });
  }

  function setDefault(e) {
    setPanelState({
      ...panelState,
      defaultApplied: true,
      defaultRequested: false,
    })
  }

  function requestDefault(e) {
    setPanelState({
      ...panelState,
      defaultRequested: true,
    })
  }

  function cancelDefaultRequest(e) {
    setPanelState({
      ...panelState,
      defaultRequested: false,
    })
  }

  function apply(e) {
    onSubmit({
      type: panelState.type,
      settings: panelRef.current.state,
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
          <Breadcrumbs className={classes.title} component="div">
            <Typography variant="subtitle1">
              {dialogLabels.settings}
            </Typography>
            <Typography variant="subtitle1">
              {panelLabelVariants[panelState.type]}
            </Typography>
          </Breadcrumbs>
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
          value={panelState.type}
          onChange={changePanel}
        >
          {Object.entries(panelLabelVariants).map(([key, value]) => (
            <Tab key={`setting-tab-${value}`} label={value} value={key} />
          ))}
        </Tabs>
      </Drawer>
      <div className={classes.content}>
        <div 
          className={clsx(classes.panels, drawerOpen ? classes.panelTransitionClose : classes.panelTransitionOpen)}
        >
          <ThemePanel 
            {...(panelState.type === 'theme') && {ref: panelRef}} 
            hidden={panelState.type !== 'theme'} 
            settings={data[panelState.type]}
          /> 
        </div>
        <DialogActions className={classes.actions}>
          <Button onClick={onCancel}>{dialogLabels.close}</Button>
          <Button onClick={requestDefault}>{dialogLabels.default}</Button>
          <Button onClick={apply}>{dialogLabels.apply}</Button>
        </DialogActions>
      </div>
      <ConfirmationDialog 
        open={panelState.defaultRequested}
        onSubmit={setDefault}
        onCancel={cancelDefaultRequest}
        message={dialogLabels.settingsDefaultConfirmation}
      />
    </Dialog>
  )
}

const drawerWidth = 150;

const useStyles = makeStyles(theme => ({
  root: {
  },
  appBar: {
    backgroundColor: theme.colors.appBar[theme.palette.type],
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

export default React.memo(SettingsDialog);
