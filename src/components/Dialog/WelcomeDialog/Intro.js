import React from 'react'

import {
  Typography,
  Link,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';


function StepOne({onSkip, onNext, onOpenAddDialog}) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <div className={classes.section}>
        <Typography variant="h4">What?</Typography>
        <Typography variant="body2">
          pqSudoku is an open source <strong>editor</strong>, a playground for Sudoku and
          potentially more grid-based puzzles, built with contemporary technologies 
          and continuously evolving with the help of our community. Our inspirations include{'\u00A0'}
          <Link href="http://www.littlegogs.com" target="_blank">Duncan's SuDoku Solver</Link>,{'\u00A0'}
          <Link href="https://puzzlemadness.co.uk/" target="_blank">Puzzle Madness</Link>,{'\u00A0'}
          <Link href="https://sudoku.com" target="_blank">Easybrain's Sudoku</Link>, and{'\u00A0'}
          <Link href="https://www.youtube.com/channel/UCC-UOdK8-mIjxBQm_ot1T-Q/featured" target="_blank">Cracking The Cryptic</Link>.
        </Typography>
      </div>

      <div className={classes.section}>
        <Typography variant="h4">Why?</Typography>
        <Typography variant="body2">
          Because we love puzzles and we know you do too. More importantly, we respect those 
          who put their time and effort into crafting such creative puzzles we all enjoy. pqSudoku 
          is our attempt to provide a platform with ease of collaboration, customizability, and extensibility 
          for anyone interested in making puzzles. 
        </Typography>
      </div>

      <div className={classes.section}>
        <Typography variant="h4">How?</Typography>
        <Typography variant="body2">
            We are glad you asked. We recommend you take a quick moment for
            initial setup and a look-around tour by clicking{'\u00A0'}
          <Typography 
            className={classes.inlineBtn}
            onClick={onNext}
            component="span" 
            variant="body2" 
            color="primary"
          >
            next
          </Typography>
            . Of course, if you have been here before or are 
            too eager to wait,{'\u00A0'}
          <Typography 
            className={classes.inlineBtn}
            onClick={onSkip}
            component="span" 
            variant="body2" 
            color="primary"
          >
            skip{'\u00A0'}
          </Typography> 
            right ahead or start{'\u00A0'}
          <Typography 
            className={classes.inlineBtn}
            onClick={onOpenAddDialog}
            component="span" 
            variant="body2" 
            color="primary"
          >
            adding a sudoku.{'\u00A0'}
          </Typography>
            For best experience, please consider using Chrome or Firefox.
        </Typography>
      </div>
    </React.Fragment>
  )
}

const useStyles = makeStyles(theme => ({
  inlineBtn: {
    cursor: 'pointer',
    borderRadius: 4,
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  section: {
    marginBottom: theme.spacing(2),
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly ',
    [theme.breakpoints.up('lg')]: {
      width: '80%'
    },
  },
}));

export default React.memo(StepOne);
