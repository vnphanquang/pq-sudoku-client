import React from 'react';
import clsx from 'clsx';

import { amber, green } from '@material-ui/core/colors';
import {
  IconButton,
  Slide,
  Snackbar,
  SnackbarContent,
} from '@material-ui/core';
import {
  CheckCircle as CheckCircleIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

import { useDispatch, useSelector } from 'react-redux';
import { 
  SnackbarClose,
  SNACKBAR_GENERIC_ERROR,
  SNACKBAR_GENERIC_SUCCESS,
  SNACKBAR_GENERIC_INFO,
} from '../../redux/actions/snackbar';

const iconVariants = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
}

const variants = {
  [SNACKBAR_GENERIC_ERROR]: {
    type: 'error',
  },
  [SNACKBAR_GENERIC_SUCCESS]: {
    type: 'success',
  },
  [SNACKBAR_GENERIC_INFO]: {
    type: 'info',
  },
}

const SlideTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

//TODO: refactor, use HoC & Connect?
function SnackbarPQS() {
  const classes = useStyles();
  const snackbar = useSelector(state => state.snackbar);
  const dispatch = useDispatch();

  function handleClose(e, reason) {
    if (reason !== 'clickaway') {
      dispatch(SnackbarClose());
    }
  }
  let content = null;
  let type = null;
  let autoHideDuration = null;
  if (snackbar.type) {
    const variant = variants[snackbar.type];
    type = variant.type;
    autoHideDuration = variant.autoHideDuration;
    const apply = variant.apply;
    const {message} = snackbar.payload;
    const Icon = iconVariants[type];
    const actions = [];
    if (apply) {
      actions.push(
        <IconButton key="snackbarApplyBtn" onClick={apply(dispatch)}>
          <CheckIcon className={classes.actions}/>
        </IconButton>
      )
    }
    actions.push(
      <IconButton key="snackbarCloseBtn" onClick={handleClose}>
        <CloseIcon className={classes.actions}/>
      </IconButton>
    )
    // TODO: content should persist!
    content = (
      <SnackbarContent
        className={clsx(classes[type], classes.content)}
        message={
          <span className={classes.message}>
            {Icon && <Icon className={classes.icon}/>}
            {message}
          </span>
        }
        action={actions}
      />
    )
  }
  return (
    <Snackbar
      open={type !== null}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      autoHideDuration={autoHideDuration !== null ? autoHideDuration : 8000}
    >
      {content}
    </Snackbar>
  )
}

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: green[600],
  },
  
  error: {
    backgroundColor: theme.palette.error.dark,
  },

  info: {
    backgroundColor: theme.palette.primary.main,
  },

  warning: {
    backgroundColor: amber[700],
  },

  content: {
    margin: theme.spacing(1),
    flexWrap: 'nowrap',
  }, 

  message: {
    display: 'flex',
    alignItems: 'center',
  },

  icon: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },

  actions: {
    fontSize: 20,
  },
}))

export default SnackbarPQS;


