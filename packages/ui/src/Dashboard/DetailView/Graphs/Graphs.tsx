import React, { Component } from 'react';
import { createStyles, Grid, withStyles } from '@material-ui/core';
import { Stock, TradeTick } from '@se/core';
import Chart from './Chart';

const styles = () => createStyles({});

export interface GraphProps {
  selectedStockTickData?: TradeTick[];
  selectedStock?: Stock;
}
class Graphs extends Component<GraphProps> {
  render() {
    return (
      <Grid container direction="column" style={{ height: '100%' }}>
        <Grid item>
          <Chart {...this.props} />
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Graphs);
