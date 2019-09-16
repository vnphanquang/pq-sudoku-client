import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Container from '@material-ui/core/Container';
import Slide from '@material-ui/core/Slide';
import Appbar from '@material-ui/core/Appbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {makeStyles, styled} from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';

import {dialogLabels} from '../../../lang';

const SlideTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

function SettingsDialog({onSubmit, onCancel, data: {theme}}) {
  const classes = useStyles();
  const appearanceRef = React.useRef(null);
  const [activePanel, setActivePanel] = React.useState(0);

  function changePanel(e, index) {
    setActivePanel(index);
  }

  function submit(e) {
    e.preventDefault();
    console.log(appearanceRef.current.state);
    // onSubmit({
    //   theme: appearanceRef.current.state,
    // })
  }

  return (
    <Dialog
      className={classes.root}
      fullScreen
      open
      onClose={onCancel}
      TransitionComponent={SlideTransition}
    >
      <AppBar className={classes.appBar} position="relative">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {dialogLabels.settings}
          </Typography>
        </Toolbar>
      </AppBar>
      <form action="" onSubmit={submit} className={classes.content}>
        <div className={classes.tabs}>
          <Tabs
            className={classes.tabLabels}
            orientation="vertical"
            variant="scrollable"
            value={activePanel}
            onChange={changePanel}
          >
            <Tab label="Appearance"  />
            <Tab label="Sudoku"  />
            {/* <Tab label="Shortcuts" />
            <Tab label="Item Four"  />
            <Tab label="Item Five"  />
            <Tab label="Item Six"  /> */}
          </Tabs>
          <div className={classes.panels}>
            <AppearancePanel ref={appearanceRef} hidden={activePanel !== 0} index={0} theme={theme}>1</AppearancePanel>
            <SettingPanel hidden={activePanel !== 1} index={1}>2</SettingPanel>
            {/* <SettingPanel hidden={activePanel !== 2} index={2}>3</SettingPanel>
            <SettingPanel hidden={activePanel !== 3} index={3}>4</SettingPanel>
            <SettingPanel hidden={activePanel !== 4} index={4}>5</SettingPanel>
            <SettingPanel hidden={activePanel !== 5} index={5}>6</SettingPanel> */}
          </div>
        </div>
        <DialogActions className={classes.actions}>
          <Button onClick={onCancel}>{dialogLabels.cancel}</Button>
          <Button type="submit">{dialogLabels.apply}</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

function SettingPanel(props) {
  const {children, index, ...other} = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      id={`settings-tabpanel-${index}`}
      {...other}
    >
      <Box p={3}>
        {children}
      </Box>
      
    </Typography>
  )
}

// function AppearancePanel(props) {
//   const {index, hidden, theme} = props;

//   return (
//     <React.Fragment>

//     </React.Fragment>
//   )
// }

const colorInputVariants = {
  baseBg: 'Base',
  hoverBg: 'Hovered',
  litBg: 'Lit',
  spottedBg: 'Spotted',
  conflictingBg: 'Conflicting',
  selectedBg: 'Selected',
  focusedBg: 'Focused'
}

class AppearancePanel extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = props.theme;
    this.handleCellColorInput = this.handleCellColorInput.bind(this);
  }

  handleCellColorInput(e) {
    const {name, value} = e.target;
    const themeType = this.state.type;
    const colorInstance = this.state.sudoku.cell[name];
    this.setState({
      sudoku: {
        ...this.state.sudoku,
        cell: {
          ...this.state.sudoku.cell,
          [name]: {
            ...colorInstance,
            [themeType]: value
          }
        }
      }
    })

  }
  

  render() {
    console.log('Appearance Panel rendered');

    const themeType = this.state.type;
    const cellColorInputs = [];
    let id;
    Object.entries(this.state.sudoku.cell).forEach(([key, value]) => {
      id = `theme-input-${key}`;
      cellColorInputs.push(
        <div key={id}>
          <label 
            htmlFor={id}
          >
            {colorInputVariants[key]}
          </label>
          <ColorInput
            type="color"
            id={id}
            name={key}
            value={value[themeType]}
            onChange={this.handleCellColorInput}
          />
        </div>
      )
    })

    return (
      <PanelContainer hidden={this.props.hidden}>
        {cellColorInputs}
      </PanelContainer>
    )
  }
}

const PanelContainer = styled(({...props}) => <div {...props}/>)(
  ({hidden}) => ({
    display: hidden ? 'none' : 'flex',
    flexDirection: 'column'
  })
)

const ColorInput = styled(({...props}) => <input {...props}/>)(
  ({theme}) => ({
    border: 'none',
    backgroundColor: 'transparent',
    width: '50px',
    height: '50px',
    cursor: 'pointer',
    padding: 0,
  })
)

const useStyles = makeStyles(theme => ({
  root: {
    // width: '100%',
    // flexDirection:
    // height: '100%',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  tabs: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  tabLabels: {
    borderRight: `1px solid ${theme.palette.divider}`,
    paddingTop: theme.spacing(2),
  },
  panels: {
    flexGrow: 1,
  },
  actions: {
    // justifySelf: 'end'
  },
  hidden: {
    display: 'none',
  }
}));

export default SettingsDialog;
