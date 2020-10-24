import React, { Component } from 'react';
import { createStyles, Divider, Grid, Theme, withStyles, WithStyles } from '@material-ui/core';
import { AppProps } from '../../App';
import StockItem from './StockItem/StockItem';
import { Amount, LtpMap, OrderType, Stock } from '@se/core';

const styles = (theme: Theme) => createStyles({});

export interface ListStockProps extends WithStyles<typeof styles>, AppProps {
  updateSelectedStock : (selectedStock: Stock) => void;
  updateSelectedOrderType : (selectedOrderType: OrderType) => void;
  ltpMap: LtpMap;
}

interface State {}

class ListOfStocks extends Component<ListStockProps, State> {
  constructor(props: ListStockProps) {
    super(props);
    this.state = {};
  }

  render() {
    const { ltpMap } = this.props
    return (
      <Grid container direction="column">
        {Object.keys(ltpMap)
          .map((stock) => {
            return { stock: stock as Stock, ltp: ltpMap[stock as Stock] as Amount };
          })
          .map((item) => {
            return (
              <Grid item key={item.stock}>
                <StockItem stock={item.stock} ltp={item.ltp} {...this.props} />
                <Divider />
              </Grid>
            );
          })}
      </Grid>
    );
  }
}

export default withStyles(styles)(ListOfStocks);
