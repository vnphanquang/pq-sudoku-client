import React from 'react';

import {makeStyles} from '@material-ui/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Button,
  TextField,
  InputLabel,
  InputAdornment,
  Select,
} from '@material-ui/core';

import SudokuSVG from './SudokuSVG';
import {dialogLabels} from '../../lang';

//TODO: implement PDF export
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

function ExportDialog({onSubmit, onCancel, data:sudoku}) {
  const classes = useStyles();
  const [name, setName] = React.useState(sudoku.name);
  const [format, setFormat] = React.useState(SVG);
  const [pngSize, setPngSize] = React.useState(500);
  
  const svgRef = React.useRef(null);

  const exportSudoku = (e) => {
      e.preventDefault();
      switch (format) {
        case SVG:
          onSubmit(name, format, generateSVGDataURL(svgRef.current));
          break;
        case PNG:
        case JPEG:
          const svgClone = svgRef.current.cloneNode(true);
          svgClone.setAttribute('width', pngSize);
          svgClone.setAttribute('height', pngSize);
          const canvas = document.createElement('canvas');
          canvas.height = pngSize;
          canvas.width = pngSize;
          const img = new Image(pngSize, pngSize);
          img.src = generateSVGDataURL(svgClone);
          img.onload = () => {
            const ctx = canvas.getContext('2d');
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
    <Dialog
      classes={{paper: classes.paper}}
      onClose={onCancel}
      open
    >
      <DialogTitle>{dialogLabels.export}</DialogTitle>
      <form 
        action="" 
        onSubmit={exportSudoku}
      >
        <DialogContent dividers className={classes.content}>
          <div>
            <TextField
              className={classes.name}
              type="text"
              required
              error={name.length === 0}
              label={dialogLabels.sudokuName.label}
              placeholder={dialogLabels.sudokuName.placeholder}
              fullWidth
              margin="dense"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={classes.settings}>
            <FormControl component="fieldset">
              <InputLabel htmlFor="format">{dialogLabels.format}</InputLabel>
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

            <TextField
              className={classes.pngSize}
              disabled={format !== JPEG && format !== PNG}
              required={format === JPEG || format === PNG}
              error={pngSize > 10000 || pngSize < 100}
              label={dialogLabels.size}
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
            <label>{dialogLabels.preview}</label>
            <SudokuSVG 
              className={classes.svg}
              id="sudoku-svg"
              svgRef={svgRef}
              name={name}
              //FIXME: save cellsData to state!
              cellValues={window.sudokus.getCellValues()}
              size={sudoku.size}
            />
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={onCancel}>{dialogLabels.cancel}</Button>
          <Button type="submit">{dialogLabels.export}</Button>
        </DialogActions>
      </form>

    </Dialog>
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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  settings: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: theme.spacing(1, 0),
  },

  name: {
    // marginRight: '20px',
  },

  format: {
    minWidth: '100px',
  },

  pngSize: {
    marginLeft: theme.spacing(2),
    maxWidth: '200px'
  },

  preview: {
    display: 'block',
    width: '100%',
    maxWidth: 300,
  },
  svg: {
    width: '100%',
  }

}));

export default React.memo(ExportDialog);
