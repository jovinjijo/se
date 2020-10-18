import React, { Component } from 'react';
import { createStyles, Divider, Grid, Theme, WithStyles, withStyles } from '@material-ui/core';
import { HoldingsData, Stock, Quantity, OrderType } from '@se/core';
import HoldingItem from './HoldingsItem/HoldingItem';

const styles = (theme: Theme) => createStyles({});

interface HoldingsProps extends WithStyles<typeof styles> {
  holdings: HoldingsData;
  updateSelectedStock : (selectedStock: Stock) => void;
  updateSelectedOrderType : (selectedOrderType: OrderType) => void;
}

class Holdings extends Component<HoldingsProps> {
  render() {
    const { holdings, updateSelectedStock, updateSelectedOrderType } = this.props;
    return (
      <Grid container direction="column">
        {Object.keys(holdings)
          .map((key) => {
            return { stock: key as Stock, quantity: holdings[key as Stock] as Quantity };
          })
          .map((item) => {
            return (
              <Grid item key={item.stock}>
                <HoldingItem {...{updateSelectedStock, updateSelectedOrderType, ...item}} />
                <Divider />
              </Grid>
            );
          })}
      </Grid>
    );
  }
}

export default withStyles(styles)(Holdings);
