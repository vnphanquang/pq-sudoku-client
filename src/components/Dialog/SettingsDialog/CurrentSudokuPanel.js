import React from 'react';

import {
  Divider,
  Typography,
  TextField,
  Tooltip,
  Input,
  Grid,
  Link,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

import { StyledGrid } from '../../Sudoku/Grid';
import { StyledCell } from '../../Sudoku/Cell';
import { STYLE_STATES} from '../../utils';
import { dialogLabels } from '../../../lang';

class CurrentSudokuPanel extends React.PureComponent {
  constructor(props) {
    super(props);
  
    this.state = props.settings;
    this.handleChange = this.handleChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
  }
  
  handleChange(e) {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
    })
  }

  handleValueChange(e) {
    if (!this.state.values.some(value => value === e.target.value)) {
      const targetIndex = parseInt(e.target.name);
      this.setState({
        ...this.state,
        values: this.state.values.map((value, index) => {
          if (index === targetIndex) {
            return e.target.value;
          } else {
            return value;
          }
        })
      })
    }
  }

  render() {
    const classes = this.props.classes;

    let content = null;
    if (this.state !== null) {
      const demoCells = [];
      const subgridSize = Math.sqrt(this.state.size);
      let index = 0;
      for (let row = 0; row < subgridSize; row++) {
        for (let col = 0; col < subgridSize; col++) {
          demoCells.push(
            <StyledCell
                key={`demo-cell-${row}-${col}`}
                row={row} col={col}
                styleState={this.state.values[index].length === 0 && STYLE_STATES.CONFLICTING}
              >
                <Tooltip className={classes.demoCellWrapper} title={`insert label #${index+1}`}>
                  <Input
                    required
                    disableUnderline
                    value={this.state.values[index]}
                    name={`${index}`}
                    onChange={this.handleValueChange}
                    type="text"
                    inputProps={{maxLength: 2, minLength: 1}}
                  />
                </Tooltip>
            </StyledCell>
          )
          index++;
        }
      }
      content = (
        <React.Fragment>
          <Grid container>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                error={this.state.name.length === 0}
                required
                fullWidth
                label={dialogLabels.name}
                type="text"
                variant="outlined"
                name="name"
                value={this.state.name}
                onChange={this.handleChange}
              />
            </Grid>
          </Grid>
          <Divider className={classes.divider}/>
          <Typography 
            variant="body1" 
          >
            {dialogLabels.sudokus.valueMapping}
          </Typography>
          <Grid container className={classes.values}>
            <Grid item xs={4} md={2} container alignItems="center">
              <Typography
                variant="body2"
              >
                Click on preview grid and input any (unique) {
                  <Link href="https://en.wikipedia.org/wiki/UTF-16" target="_blank">
                    UTF-16
                  </Link>
                } character(s) (including emojis) to map them instead of using default values.
              </Typography>
            </Grid>
            <Grid item xs={8} sm={6} md={3} container justify="center">
              <StyledGrid className={classes.demoGrid} rows={subgridSize} cols={subgridSize}>
                {demoCells}
              </StyledGrid>
            </Grid>
          </Grid>
        </React.Fragment>
      )
    } else {
      content = (
        <Typography variant="body1" align="center">No active sudoku</Typography>
      )
    }
    
    return (
      <div className={classes.root}>
        {content}
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
  demoGrid: {
    width: 200,
    height: 200,
  },
  demoCellWrapper: {
    width: '100%',
    height: '100%',
    '& input': {
      cursor: 'pointer',
      textAlign: 'center',
    },
  },
})

export default withStyles(styles)(CurrentSudokuPanel);
