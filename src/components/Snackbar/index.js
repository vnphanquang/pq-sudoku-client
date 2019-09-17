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
  Close as CloseIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

import { useDispatch, useSelector } from 'react-redux';
import { SnackbarClose } from '../../redux/actions';




const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
}

const SlideTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});
// function SlideTransition(props) {
//   return <Slide {...props} direction="right" />;
// }


function SnackbarPQS() {
  const classes = useStyles();
  const {type, message} = useSelector(state => state.snackbar);
  const dispatch = useDispatch();

  function handleClose(e, reason) {
    if (reason !== 'clickaway') {
      dispatch(SnackbarClose());
    }
  }

  const Icon = variantIcon[type];

  return (
    <Snackbar
      open={type !== null}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      autoHideDuration={5000}
    >
      <SnackbarContent
        className={clsx(classes[type], classes.content)}
        message={
          <span className={classes.message}>
            {Icon && <Icon className={classes.icon}/>}
            {message}
          </span>
        }
        action={[
          <IconButton key="snackbarCloseBtn" onClick={handleClose}>
            <CloseIcon className={classes.closeBtn}/>
          </IconButton>
        ]}
      />
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
  }, 

  message: {
    display: 'flex',
    alignItems: 'center',
  },

  icon: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },

  closeBtn: {
    fontSize: 20,
  },
}))

export default SnackbarPQS;

