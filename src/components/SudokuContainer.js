import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {ADD_TAB} from '../redux/actions'

import {makeStyles} from '@material-ui/styles';

import {COLLAPSED_DRAWER_WIDTH, APPBAR_HEIGHT} from './utils';
import Sudoku from './Sudoku';

function SudokuContainer() {
  const classes = useStyles();

  return (
    <div className = {classes.root}>
      <Sudoku />
    </div>
  )
}

export default SudokuContainer



const useStyles = makeStyles( theme => ({
  root: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: APPBAR_HEIGHT,
    paddingLeft: COLLAPSED_DRAWER_WIDTH,
  }
}))