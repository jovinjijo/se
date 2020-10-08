import React, { Component } from 'react';
import { createStyles, Divider, Grid, Theme, withStyles, WithStyles } from '@material-ui/core';
import { AppProps } from '../../App';
import StockItem from './StockItem/StockItem';
import { Stock } from '@se/core';

const styles = (theme: Theme) => createStyles({});

interface ListStockProps extends WithStyles<typeof styles>, AppProps {}

interface State {}

class ListOfStocks extends Component<ListStockProps, State> {
  constructor(props: ListStockProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Grid container direction="column">
        {Object.keys(Stock)
          .map((stock) => {
            return { stock: stock, ltp: 451 };
          })
          .map((item) => {
            return (
              <Grid item key={item.stock}>
                <StockItem stock={item.stock as Stock} ltp={item.ltp} />
                <Divider />
              </Grid>
            );
          })}
      </Grid>
    );
  }
}

export default withStyles(styles)(ListOfStocks);
