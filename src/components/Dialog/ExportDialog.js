import React from 'react';
import {makeStyles} from '@material-ui/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

import SudokuSVG from './SudokuSVG';

const SVG = 'svg';
const PNG = 'png';
const PDF = 'pdf';
const formats = [SVG, PNG, PDF];

function ExportDialog({onSubmit, onCancel, sudoku}) {
  const classes = useStyles();
  const [name, setName] = React.useState(sudoku.name);
  const [format, setFormat] = React.useState('svg');

  const svgRef = React.useRef(null);
  const aRef = React.useRef(null);

  const exportSudoku = React.useCallback(
    () => {
      // const svgClone = svgRef.current.cloneNode(true);
      // const svgDocType = document.implementation.createDocumentType('svg', "-//W3C//DTD SVG 1.1//EN", "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd");
      // const svgXMLDoc = document.implementation.createDocument('http://www.w3.org/2000/svg', 'svg', svgDocType);
      // svgXMLDoc.replaceChild(svgClone, svgXMLDoc.documentElement);
      const svgDataStr = (new XMLSerializer()).serializeToString(svgRef.current);
      let svgBlob = new Blob([svgDataStr], {type: 'image/svg+xml;charset=utf-8'});
      let svgDataURL = URL.createObjectURL(svgBlob);
      aRef.current.href = svgDataURL;
      aRef.current.click();
      URL.revokeObjectURL(svgDataURL)
    },
    []
  )

  return (
    <React.Fragment>
      <Dialog
        maxWidth={false}
        classes={{paper: classes.paper}}
        onClose={onCancel}
        open
      >
        <DialogTitle>Export</DialogTitle>

        <div className={classes.content}>
          <div className={classes.settings}>
            <TextField
              className={classes.name}
              autoFocus
              margin="dense"
              fullWidth={false}
              label="Name"
              type="text"
              variant="filled"
              placeholder="Sudoku Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <FormControl component="fieldset">
              <InputLabel htmlFor="format">Format</InputLabel>
              <Select
                native
                autoWidth
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                inputProps={{name: 'format'}}
              >
                {formats.map(format => (
                  <option key={`format-option-${format}`} value={format}>{format}</option>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className={classes.preview}>
            <label>Preview</label>
            <SudokuSVG 
              id="sudoku-svg"
              svgRef={svgRef}
              name={name}
              cellValues={window.sudoku.getCellValues()}
            />
          </div>
        </div>

        <DialogActions>
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={exportSudoku}>Export</Button>
          <a 
            style={{display: 'none'}}
            href="/"
            download={`${name}.${format}`}
            ref={aRef}
          >
            (hidden)Export
          </a>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

const useStyles = makeStyles(theme => ({
  paper: {
    minwidth: '300px',
    // height: '80%',
    // width: '80%',
    // minWidth: 250,
  },

  content: {
    padding: '0 20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  settings: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0'
  },

  name: {
    paddingRight: '20px',
  },

  preview: {
    display: 'block',
    width: '100%',
    maxWidth: '300px'
  }

}));

export default ExportDialog;
