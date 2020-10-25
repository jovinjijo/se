import React, { Component } from 'react';
import { createStyles, Divider, Grid, WithStyles, withStyles } from '@material-ui/core';
import BuySell from './BuySell/BuySell';
import AdditionalDetails from './AdditionalDetails/AdditionalDetails';
import { DetailViewProps } from '../DetailView';

const styles = () => createStyles({});

interface Props extends WithStyles<typeof styles>, Omit<DetailViewProps, 'classes'> {}

interface State {
  buySellVisible: boolean;
}

class ActionsDetails extends Component<Props, State> {
  render() {
    return (
      <Grid container direction="row" style={{ justifyContent: 'space-around', height: '100%' }}>
        <Grid item style={{ width: '35%' }}>
          <BuySell {...this.props} />
        </Grid>
        <Grid item>
          <Divider orientation="vertical" />
        </Grid>
        <Grid item style={{ width: '64%' }}>
          <AdditionalDetails {...this.props} />
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(ActionsDetails);
