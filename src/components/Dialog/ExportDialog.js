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
import InputAdornment from '@material-ui/core/InputAdornment';

import SudokuSVG from './SudokuSVG';

const SVG = 'svg';
const PNG = 'png';
const JPEG = 'jpeg';
const formats = [SVG, PNG, JPEG];

function generateSVGDataURL(svgElement) {
  return URL.createObjectURL(
    new Blob(
      [(new XMLSerializer()).serializeToString(svgElement)],
      {type: 'image/svg+xml;charset=utf-8'}
    )
  )
}

function canvasToBlobPolyfill() {
  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    value: function (callback, type, quality) {
      var canvas = this;
      setTimeout(function () {
        var binStr = atob(canvas.toDataURL(type, quality).split(',')[1]),
          len = binStr.length,
          arr = new Uint8Array(len);

        for (var i = 0; i < len; i++) {
          arr[i] = binStr.charCodeAt(i);
        }

        callback(new Blob([arr], { type: type || 'image/png' }));
      });
    }
  });
}

function ExportDialog({onSubmit, onCancel, sudoku}) {
  const classes = useStyles();
  const [name, setName] = React.useState(sudoku.name);
  const [format, setFormat] = React.useState(SVG);
  const [pngSize, setPngSize] = React.useState(500);
  
  const svgRef = React.useRef(null);

  const exportSudoku = (e) => {
      e.preventDefault();
      let svgDataURL;
      switch (format) {
        case SVG:
          svgDataURL = generateSVGDataURL(svgRef.current);
          onSubmit(name, format, svgDataURL);
          break;
        case PNG:
        case JPEG:
          const svgClone = svgRef.current.cloneNode(true);
          svgClone.setAttribute('width', pngSize);
          svgClone.setAttribute('height', pngSize);
          svgDataURL = generateSVGDataURL(svgClone);
          const canvas = document.createElement('canvas');
          canvas.height = pngSize;
          canvas.width = pngSize;
          const img = new Image(pngSize, pngSize);
          img.src = svgDataURL;
          img.onload = () => {
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, pngSize, pngSize);

            if (!HTMLCanvasElement.prototype.toBlob) canvasToBlobPolyfill();
            
            canvas.toBlob((blob) => {
              const imgDataURL = URL.createObjectURL(blob);
              onSubmit(name, format, imgDataURL);
            }, `image/${format}`, 1);
          }
          break;
        default:
          break;
      }
      
    }

  return (
    <React.Fragment>
      <Dialog
        maxWidth={false}
        classes={{paper: classes.paper}}
        onClose={onCancel}
        open
      >
        <DialogTitle>Export</DialogTitle>
        <form 
          action="" 
          onSubmit={exportSudoku}
        >
          <div className={classes.content}>
            <div className={classes.settings}>
              <TextField
                className={classes.name}
                required
                error={name.length === 0}
                autoFocus
                margin="dense"
                fullWidth={false}
                label="Name"
                type="text"
                variant="outlined"
                placeholder="Sudoku Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <FormControl component="fieldset">
                <InputLabel htmlFor="format">Format</InputLabel>
                <Select
                  className={classes.format}
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

            <div>
              <TextField
                className={classes.pngSize}
                disabled={format !== JPEG && format !== PNG}
                required={format === JPEG || format === PNG}
                error={pngSize > 10000 || pngSize < 100}
                label="Size"
                value={pngSize}
                onChange={(e) => setPngSize(e.target.value)}
                placeholder="(100 to 10,000)"
                type="number"
                InputProps={{
                  endAdornment: <InputAdornment position="end">px</InputAdornment>,
                }}
                inputProps={{ min: 100, max: 10000}}
                variant="outlined"
                margin="dense"
                
              />
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
          <Button type="submit">Export</Button>
        </DialogActions>
        </form>

      </Dialog>
    </React.Fragment>
  )
}

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1),
  },

  textField: {
    flexBasis: 200,
  },

  paper: {
    minWidth: '300px',
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
    marginRight: '20px',
  },

  format: {
    minWidth: '100px',
  },

  pngSize: {
    marginLeft: '20px',
    maxWidth: '200px'
  },

  preview: {
    display: 'block',
    width: '100%',
    maxWidth: '300px'
  }

}));

export default ExportDialog;
