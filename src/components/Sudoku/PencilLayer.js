import React from 'react';
import {makeStyles} from '@material-ui/styles';

function PencilLayer({pencils}) {
  console.log('PencilLayer inside');

  const classes = useStyles({pencils});
  let marks = [];

  pencils.forEach((value, index) => {
    marks.push(
      <div className={classes.pencil} key={index}> {value} </div>
    )
  })

  return (
    <div className={classes.root}>
      {marks}
    </div>
  )
}

const useStyles = makeStyles({
  root: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'grid',
    justifyContent: 'center',
    gridTemplateColumns: ({pencils}) => `repeat(${Math.sqrt(pencils.length)}, 1fr)`,
    gridTemplateRows: ({pencils}) => `repeat(${Math.sqrt(pencils.length)}, 1fr)`,
    fontSize: '.9rem',
    textAlign: 'center',
    lineHeight: '100%'
  },
  pencil: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
})


export default PencilLayer;

