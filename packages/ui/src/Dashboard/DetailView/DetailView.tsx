import React, { Component } from 'react';
import { createStyles, Divider, Grid, withStyles, WithStyles } from '@material-ui/core';
import ActionsDetails from './ActionsDetails/ActionsDetails';
import Graphs from './Graphs/Graphs';
import { UserStoreItemDetails } from '@se/api';
import { AppProps } from '../../App';
import { OrderType, Stock, TradeTick } from '@se/core';

const styles = () => createStyles({});

interface DetailViewProps extends WithStyles<typeof styles>, AppProps {
  user: UserStoreItemDetails;
  selectedStock?: Stock;
  selectedOrderType: OrderType;
  selectedStockTickData?: TradeTick[];
  fetchUserDetails: () => void;
  updateSelectedStock: (selectedStock: Stock) => void;
  updateSelectedOrderType: (selectedOrderType: OrderType) => void;
}

class DetailView extends Component<DetailViewProps> {
  constructor(props: DetailViewProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Grid container direction="column" style={{ height: '100%' }}>
        <Grid item style={{ height: '50%' }}>
          <Graphs {...this.props} />
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
