import React, { Component } from 'react';
import { createStyles, Divider, Grid, Theme, withStyles, WithStyles } from '@material-ui/core';
import ActionsDetails from './ActionsDetails/ActionsDetails';
import Graphs from './Graphs/Graphs';
import { UserStoreItemDetails } from '@se/api';

const styles = (theme: Theme) => createStyles({});

export interface DetailViewProps extends WithStyles<typeof styles> {
  user: UserStoreItemDetails;
}

interface State {}

class DetailView extends Component<DetailViewProps, State> {
  constructor(props: DetailViewProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Grid container direction="column" style={{ height: '100%' }}>
        <Grid item style={{ height: '50%' }}>
          <Graphs />
        </Grid>
        <Grid item>
          <Divider />
        </Grid>
        <Grid item style={{ height: '49%' }}>
          <ActionsDetails {...this.props} />
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(DetailView);
