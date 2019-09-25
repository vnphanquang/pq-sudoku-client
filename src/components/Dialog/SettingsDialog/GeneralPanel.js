import React from 'react';

import {
  Divider,
  Typography,
  Switch,
} from '@material-ui/core';

import { withStyles } from '@material-ui/styles';

class GeneralPanel extends React.PureComponent {
  constructor(props) {
    super(props);
  
    this.state = props.settings;
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(e) {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.checked,
    })
  }


  render() {
    const classes = this.props.classes;
    return (
      <div className={classes.root}>
        <div className={classes.toggleItem}>
          <Typography variant="body1">Show save prompt on tab close:</Typography>
          <Switch 
            checked={this.state.saveAsPromptOnTabClose}
            onChange={this.handleChange}
            color="primary"
            name="saveAsPromptOnTabClose"
          />
        </div>
        <Divider className={classes.divider}/>
      </div>
    )
  }
}

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2, 0),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  toggleItem: {
    display: 'flex',
    alignItems: 'center',
  },
})

export default withStyles(styles)(GeneralPanel);
