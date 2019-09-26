import React from 'react';

import {makeStyles} from '@material-ui/styles';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';

import {dialogLabels } from '../../lang';

//TODO: refactors & language separation!
const helpData = [
  ['"Double click" or "Alt+G"', 'Cell/Grid', 'Select all cells within current subgrid'],
  ['"Triple click" or "Ctrl+A"', 'Cell/Grid', 'Select all cells within current grid'],
  ['"Delete" or "Backspace"', 'Cell/Grid', 'Clear cell(s)'],
  ['"Arrow Keys"', 'Cell/Grid', 'Navigate within grid'],
  ['"Ctrl+Click" or "Ctrl+Arrow" or "Shift+Arrow"', 'Cell/Grid', 'Add cell to selection'],
  ['"Shift+Click"', 'Cell/Grid', 'Add cell(s) to selection based on locations of focused cell and clicked cell'],
  ['"Alt+R"', 'Cell/Grid', 'Select all cells within current row'],
  ['"Alt+C"', 'Cell/Grid', 'Select all cells within current column'],
  ['"Alt+P"', 'Workspace', 'Toggle pencil mode'],
  ['"Ctrl+T"', 'Workspace', 'Add'],
  ['"Ctrl+O"', 'Workspace', 'Open'],
  ['"Ctrl+S"', 'Workspace', 'Save As'],
  ['"Ctrl+E"', 'Workspace', 'Export'],
  ['"Ctrl+P"', 'Workspace', 'Settings'],
  ['"F1"', 'Workspace', 'Help'],
]

function AboutDialog({onCancel}) {
  const classes = useStyles();
  return (
    <Dialog
      classes={{paper: classes.paper}}
      onClose={onCancel}
      open
    >
    <DialogTitle>{dialogLabels.help}</DialogTitle>
      <DialogContent className={classes.content} dividers>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Action</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {helpData.map(([action, location, description], index) => (
              <TableRow key={`help-table-row-${index}`}>
                <TableCell>{action}</TableCell>
                <TableCell>{location}</TableCell>
                <TableCell>{description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{dialogLabels.close}</Button>
      </DialogActions>
    </Dialog>
  )
}

const useStyles = makeStyles(theme => ({
  paper: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      maxHeight: '100%',
      margin: 0
    },
  },
  content: {
    padding: theme.spacing(1, 1, 0),
  },
}));

export default React.memo(AboutDialog);
