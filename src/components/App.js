import React from 'react'
import Sudoku from './Sudoku'
import {makeStyles} from '@material-ui/styles'
import {CssBaseline} from '@material-ui/core'

const useStyles = makeStyles({
  root: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
})

function App() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Sudoku />
    </div>
  )
}

export default App
