import React from 'react';

import {makeStyles} from '@material-ui/styles';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
} from '@material-ui/core';

import {dialogLabels} from '../../lang';

const aboutVariant = {
  general: dialogLabels.general,
  bugReport: dialogLabels.bugReport,
  featureRequest: dialogLabels.featureRequest,
}

const detailsHintVariant = {
  general: dialogLabels.feedbackGeneralHint,
  bugReport: dialogLabels.feedbackBugReportHint,
  featureRequest: dialogLabels.feedbackGeneralHint,
}

function FeedbackDialog({onSubmit, onCancel}) {
  const classes = useStyles();

  const [data, setData] = React.useState({
    about: 'general',
    title: '',
    details: '',
  })

  function submit(e) {
    e.preventDefault();
    onSubmit({
      ...data,
      userAgent: window.navigator.userAgent
    });
  }

  function updateData(e) {
    setData({...data, [e.target.name]: e.target.value});
  }

  return (
    <Dialog
      classes={{paper: classes.paper}}
      onClose={onCancel}
      open
    >
      <DialogTitle>{dialogLabels.feedback}</DialogTitle>
      <form
        action=""
        onSubmit={submit}
      >
        <DialogContent dividers>
          <div className={classes.header}>
            <TextField
              fullWidth
              label={dialogLabels.title}
              type="text"
              variant="outlined"
              placeholder={dialogLabels.title}
              name="title"
              value={data.title}
              onChange={updateData}
            />
            <FormControl className={classes.about}>
              <FormHelperText>{dialogLabels.feedbackAboutHint}</FormHelperText>
              <Select
                value={data.about}
                onChange={updateData}
                name="about"
                variant="outlined"
              >
                {Object.entries(aboutVariant).map(([key, value]) => (
                  <MenuItem
                    key={`feedback-about-${key}`}
                    value={key}
                  >
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <TextField
            error={data.details.length === 0}
            required
            fullWidth
            multiline
            rows={2}
            label={dialogLabels.details}
            type="text"
            variant="outlined"
            placeholder={detailsHintVariant[data.about]}
            name="details"
            value={data.details}
            onChange={updateData}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>{dialogLabels.cancel}</Button>
          <Button type="submit">{dialogLabels.send}</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

const useStyles = makeStyles(theme => ({
  paper: {
    minWidth: 345,
    minHeight: 280,
    // margin:  0,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  about: {
    width: '40%',
    marginLeft: theme.spacing(1),
  }
}));

export default React.memo(FeedbackDialog);