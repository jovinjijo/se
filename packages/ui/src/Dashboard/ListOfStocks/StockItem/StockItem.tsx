import React, { Component } from 'react';
import {
  Button,
  ButtonGroup,
  createStyles,
  ListItem,
  ListItemText,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import { Amount, OrderType, Stock } from '@se/core';
import { ListStockProps } from '../ListOfStocks';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      marginRight: theme.spacing(2),
    },
  });

interface StockItemProps extends WithStyles<typeof styles>, Omit<ListStockProps, 'classes'> {
  stock: Stock;
  ltp: Amount;
}

class StockItem extends Component<StockItemProps> {
  constructor(props: StockItemProps) {
    super(props);
    this.state = {};
  }

  handleSelect = (orderType: OrderType) => () => {
    this.props.updateSelectedStock(this.props.stock);
    this.props.updateSelectedOrderType(orderType);
  };

  render() {
    return (
      <ListItem button>
        <ListItemText primary={this.props.stock} />
        <ButtonGroup size="small" variant="contained" color="primary" className={this.props.classes.root}>
          <Button onClick={this.handleSelect(OrderType.Buy)} color="primary">
            B
          </Button>
          <Button onClick={this.handleSelect(OrderType.Sell)} color="secondary">
            S
          </Button>
        </ButtonGroup>
        <span className={'MuiLabel-amount'}>{this.props.ltp}</span>
      </ListItem>
    );
  }
}

export default withStyles(styles)(StockItem);
