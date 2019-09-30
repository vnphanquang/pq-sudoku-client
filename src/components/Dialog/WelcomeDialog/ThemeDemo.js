import React from 'react';
import {
  Typography,
  Grid,
  Divider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import MobileDemoSVG from './MobileDemoSVG';

function ThemeDemo({theme, onToggleThemeType}) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Grid className={classes.mobiles} container justify="center">
        <Grid 
          item xs={5}
          container justify="space-between" alignItems="center" direction="column" 
          wrap = 'nowrap'
        >
          <MobileDemoSVG 
            theme={theme} 
            overrideThemeType="light"
            onMouseUp={() => theme.type !== 'light' && onToggleThemeType('light')}
          />
          <Typography 
            variant="body1" 
            color={theme.type === 'light' ? 'primary' : 'initial'}
          >
            Light and Bright
          </Typography>
        </Grid>
        <Grid item xs={2} container justify="center">
          <Divider orientation="vertical" />
        </Grid>
        <Grid 
          item xs={5}
          container justify="space-between" alignItems="center" direction="column"
          wrap = 'nowrap'
        >
          <MobileDemoSVG 
            theme={theme} 
            overrideThemeType="dark" 
            onMouseUp={() => theme.type !== 'dark' && onToggleThemeType('dark')}
          />
          <Typography 
            variant="body1" 
            color={theme.type === 'dark' ? 'primary' : 'initial'}
          >
            Dark and Smart
          </Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

const useStyles = makeStyles(theme => ({
  mobiles: {
    flexGrow: 1,
  }
}))

export default React.memo(ThemeDemo);