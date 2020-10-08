import React, { Component } from 'react';
import { createStyles, Grid, Theme, withStyles } from '@material-ui/core';

const styles = (theme: Theme) => createStyles({});

class Graphs extends Component {
  render() {
    return (
      <Grid container direction="column" style={{ height: '100%' }}>
        <Grid item style={{ height: '60%' }}>
          <div>Graphs</div>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Graphs);
