import React, { Component } from 'react';
import {
  Accordion,
  AccordionActions,
  AccordionSummary,
  Button,
  createStyles,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { OrderType, Stock } from '@se/core';

const styles = (theme: Theme) =>
  createStyles({
    heading: {
      flexBasis: '100%',
    },
  });

interface HoldingItemProps extends WithStyles<typeof styles> {
  stock: Stock;
  quantity: number;
  updateSelectedStock : (selectedStock: Stock) => void;
  updateSelectedOrderType : (selectedOrderType: OrderType) => void;
}

interface State {}

class HoldingItem extends Component<HoldingItemProps, State> {
  constructor(props: HoldingItemProps) {
    super(props);
    this.state = {};
  }

  handleSelect = (orderType: OrderType) => () => {
    this.props.updateSelectedStock(this.props.stock);
    this.props.updateSelectedOrderType(orderType);
  }

  render() {
    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={this.props.classes.heading}>{this.props.stock}</Typography>
          <Typography>{this.props.quantity}</Typography>
        </AccordionSummary>
        <AccordionActions>
          <Button onClick={this.handleSelect(OrderType.Buy)} color="primary" variant="contained">
            Add
          </Button>
          <Button onClick={this.handleSelect(OrderType.Sell)} color="secondary" variant="contained">
            Exit
          </Button>
        </AccordionActions>
      </Accordion>
    );
  }
}

export default withStyles(styles)(HoldingItem);
