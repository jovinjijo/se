import React, { Component } from 'react';
import { Typography, Button, ButtonGroup, TextField, Box } from '@material-ui/core';
import { createStyles, Grid, Theme, withStyles, WithStyles, Divider } from '@material-ui/core';
import { AdditionalOrderType, Amount, OrderType, Quantity, Stock } from '@se/core';
import { apiCall, getErrorMessage } from '../../../../utils/Util';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  });

interface Props extends WithStyles<typeof styles> {
  stock: Stock;
  orderType: OrderType;
}

interface State {
  quantity: Quantity;
  additionalOrderType: AdditionalOrderType;
  price: Amount;
}

class BuySell extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      quantity: 0,
      additionalOrderType: AdditionalOrderType.Market,
      price: 0,
    };
  }

  handleMarketOrder = () => this.setState({ additionalOrderType: AdditionalOrderType.Market });
  handleLimitOrder = () => this.setState({ additionalOrderType: AdditionalOrderType.Limit });

  handleBuySell = async () => {
    const sendPrice = this.state.additionalOrderType == 'Limit' ? this.state.price : 0;
    const payload = {
      symbol: this.props.stock,
      orderType: this.props.orderType,
      additionalOrderType: this.state.additionalOrderType,
      price: sendPrice,
      quantity: this.state.quantity,
    };
    try {
      const response = await apiCall('/v1/order/place', 'POST', payload);
      const error = getErrorMessage(response);
      if (error) {
        console.log('Error');
        console.log(error);
        console.log(payload);
        console.log(response);
      } else {
        console.log('Placed');
        console.log(payload);
        console.log(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const stock = this.props.stock;
    const orderType = this.props.orderType;
    return (
      <Grid container direction="column" style={{ height: '100%' }} className={this.props.classes.root}>
        <Typography variant="subtitle2">
          {orderType == OrderType.Buy ? 'BUY' : 'SELL'} {stock}
        </Typography>

        <Divider variant="middle" />

        <Box pt={1}>
          <ButtonGroup fullWidth color="primary" aria-label="additional order type button group">
            <Button
              variant={this.state.additionalOrderType == 'Market' ? 'contained' : 'outlined'}
              onClick={this.handleMarketOrder}
            >
              Market
            </Button>
            <Button
              variant={this.state.additionalOrderType == 'Limit' ? 'contained' : 'outlined'}
              onClick={this.handleLimitOrder}
            >
              Limit
            </Button>
          </ButtonGroup>
        </Box>

        <form noValidate autoComplete="off">
          <Box my={2} mt={2.5}>
            <TextField
              fullWidth
              id="quantity"
              label="Quantity"
              type="number"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                this.setState({ quantity: e.currentTarget.valueAsNumber });
              }}
            />
          </Box>
          <Box my={2}>
            <TextField
              disabled={this.state.additionalOrderType == 'Market' ? true : false}
              fullWidth
              id="price"
              label="Price"
              type="number"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                this.setState({ price: e.currentTarget.valueAsNumber });
              }}
            />
          </Box>
        </form>

        <Box>
          <Typography display="inline">
            {orderType == OrderType.Buy ? 'Buy' : 'Sell'} {stock} × {this.state.quantity} Qty
          </Typography>
          {this.state.additionalOrderType == 'Limit' && (
            <Typography display="inline"> at ₹{this.state.price}</Typography>
          )}
        </Box>

        <Box>
          <Button fullWidth color="primary" variant="contained" onClick={this.handleBuySell}>
            {orderType == OrderType.Buy ? 'Buy' : 'Sell'}
          </Button>
        </Box>
      </Grid>
    );
  }
}

export default withStyles(styles)(BuySell);
