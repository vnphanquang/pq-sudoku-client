import React from 'react';
import {VALUES} from './utils';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles({
  root: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'grid',
    justifyContent: 'center',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    fontSize: '.9rem',
    textAlign: 'center',
    lineHeight: '100%'
  }
})

function PencilLayer(props) {
  const classes = useStyles();
  let pencils = [];
  for (let i = 1; i <= VALUES.size; i++) {
    if (props.pencils.get(`${i}`)) {
      pencils.push(
        <div key={i}>
          {VALUES.get(`${i}`)}
        </div>
      )
    } else {
      pencils.push(<div key={i}></div>);
    }
  }
  return (
    <div className={classes.root}>
      {pencils}
    </div>
  )
}

export default PencilLayer
