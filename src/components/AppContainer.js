import React from 'react';
import {connect} from 'react-redux';
import {ThemeProvider} from '@material-ui/styles';
import {CssBaseline} from '@material-ui/core';
import {createMuiTheme} from '@material-ui/core/styles';
import App from './App';

class AppContainer extends React.PureComponent {
  render() {
    // console.log('AppContainer rendered');
    let {theme} = this.props;
    theme = createMuiTheme({
      palette: {
        type: theme.type
      },
      colors: theme.colors,
      sudoku: theme.sudoku,
    })

    return (
      <React.Fragment>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state, ownProps=state) => ({
  theme: (ownProps.theme.type === state.theme.type) ? ownProps.theme : state.theme
})

export default connect(mapStateToProps)(AppContainer);
