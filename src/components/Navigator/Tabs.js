import React from 'react';
// import {connect} from 'react-redux';
// import { TabChange, TabRemoval } from '../../redux/actions'
import {withStyles} from '@material-ui/styles'
import {
  Tabs,
  Tab,
  IconButton,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

class TabsPQS extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleTabChange = this.handleTabChange.bind(this);
  }
    
  handleTabChange(e, index) {
    if (index !== this.props.tabs.activeIndex)
      this.props.changeTab(index);
  }

  render() {
    console.log('Tabs rendered')
    const {classes, tabs, removeTab} = this.props;
    return (
      <Tabs
        className={classes.tabs}
        value={tabs.activeIndex !== null ? tabs.activeIndex : false}
        onChange={this.handleTabChange}
        variant="scrollable"
        scrollButtons="desktop"
        aria-label="sudoku tabs"
      >
        {tabs.array.map(({name, id}, index) => (
          <Tab
            className={classes.tab}
            key={`sudoku-tab-${id}`}
            value={index}
            // className={selected ? classes.tabSelected : classes.tab}
            label={(
                <div className={classes.tabLabel}>
                  <Typography className={classes.tabName} variant="button" display="inline">
                    {name.length > 8 ? `${name.substring(0, 8)}...` : name}
                  </Typography>
                  { 
                    tabs.activeIndex === index &&
                    <IconButton className={classes.tabCloseBtn} component='div' onClick={(e) => removeTab(index)}>
                      <CloseIcon />
                    </IconButton>
                  }
                </div>
          )}
          />
        ))}
      </Tabs>
    )
  }
}

const styles = theme => ({
  tabs: {
    flexGrow: 1,
    margin: theme.spacing(2, 0, 0, 1)
  },

  tab: {
    padding: theme.spacing(1, 0),
    minWidth: '140px',
  },

  tabSelected: {
    // backgroundColor: 'white'
  },

  tabLabel: {
    display: 'flex',
    alignItems: 'center',
  },

  tabName: {
    textTransform: 'none',
    textAlign: 'left',
    margin: theme.spacing(0, 0, 1, 0),
  },

  tabCloseBtn: {
    padding: 0,
    margin: theme.spacing(0, 0, 1, 1),
  },
})

// const mapStateToProps = state => ({
//   tabs: state.tabs,
// })

// const mapDispatchToProps = (dispatch, ownProps) => ({
//   changeTab: (index) => dispatch(TabChange(index)),
//   removeTab: (index) => dispatch(TabRemoval(index)),
// })

// export default connect(
//   mapStateToProps, 
//   mapDispatchToProps,
//   // (stateProps, dispatchProps, ownProps) => ({ ...ownProps, ...stateProps, ...dispatchProps }),
//   // {
//   //   pure: true
//   // }
// )(withStyles(styles)(TabsPQS));

export default (withStyles(styles)(TabsPQS));
