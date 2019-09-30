import React from 'react';

import { makeStyles } from '@material-ui/styles';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  MobileStepper,
} from '@material-ui/core';

import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@material-ui/icons/';

import {dialogLabels } from '../../../lang';

import contentBackground from './cogs-pattern.svg'
import Intro from './Intro';
import ThemeDemo from './ThemeDemo';
import BasicsDemoSVG from './BasicsDemoSVG';
import CreativeDemo from './CreativeDemo';

const dialogTitles = [
  'Welcome...',
  'Select your theme...',
  'The basics...',
  'Be creative!'
]
//TODO: Refactor display texts into lang.js
function WelcomeDialog({onCancel, onOpenAddDialog, onToggleThemeType, data:theme}) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  let content;
  switch(activeStep) {
    case 0:
      content = (
        <Intro 
          onNext={handleNext}
          onSkip={onCancel}
          onOpenAddDialog={onOpenAddDialog}
        />
      )
      break;
    case 1:
      content = (
        <ThemeDemo
          theme={theme}
          onToggleThemeType={onToggleThemeType}
        />
      )
      break;
    case 2:
      content = (
        <BasicsDemoSVG
          themeType={theme.type}
        />
      )
      break;
    case 3:
      content = (
        <CreativeDemo 
          themeType={theme.type}
        />
      )
      break;
    default:
      break;
  }
  return (
    <Dialog
      disableBackdropClick
      classes={{paper: classes.paper}}
      onClose={onCancel}
      open
    >
      <DialogTitle>
        {dialogTitles[activeStep]}
      </DialogTitle>
      <DialogContent className={classes.contentWrapper} dividers>
        <div className={classes.content}>
          {content}
        </div>
        <MobileStepper
          classes={{
            root: classes.stepperRoot,
            dots: classes.stepperDots,
            dot: classes.stepperDot,
          }}
          variant="dots"
          steps={dialogTitles.length}
          position="static"
          activeStep={activeStep}
        />
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button onClick={handleBack} disabled={activeStep === 0}>
          <KeyboardArrowLeft />
          {dialogLabels.back}
        </Button>
        {activeStep !== dialogTitles.length - 1  ? (
          <React.Fragment>
            <Button onClick={onCancel}>
              {dialogLabels.skip}
            </Button>
            <Button onClick={handleNext}>
              {dialogLabels.next}
              <KeyboardArrowRight />
            </Button>  
          </React.Fragment>) : (
          <Button onClick={onOpenAddDialog}>
            {dialogLabels.getStarted}
            <KeyboardArrowRight />
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

const useStyles = makeStyles(theme => ({
  paper: {
    width: '75%',
    height: '75%',
    maxHeight: 'none',
    maxWidth: 900,
    [theme.breakpoints.down('sm')]: {
      width: '95%',
      height: '75%',
      margin: 0,
    },
  },
  contentWrapper: {
    paddingBottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundImage: `url(${contentBackground})`
  },
  content: {
    flexGrow: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperRoot: {
    background: 'none',
  },
  stepperDots: {
    width: '100%',
    justifyContent: 'center',
  },
  stepperDot: {
    margin: theme.spacing(0, 1),
  },
  actions: {
    justifyContent: 'space-between',
  },
})); 

export default React.memo(WelcomeDialog);