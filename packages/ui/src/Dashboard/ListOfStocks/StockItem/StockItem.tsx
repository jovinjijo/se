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
import { Amount, Stock } from '@se/core';

const styles = (theme: Theme) => createStyles({
    root: {
        marginRight: theme.spacing(2)
    }
});

interface StockItemProps extends WithStyles<typeof styles> {
  stock: Stock;
  ltp: Amount;
}

interface State {}

class StockItem extends Component<StockItemProps, State> {
  constructor(props: StockItemProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ListItem button>
        <ListItemText primary={this.props.stock} />
        <ButtonGroup size="small" variant="contained" color="primary" className={this.props.classes.root}>
          <Button color="primary">B</Button>
          <Button color="secondary">S</Button>
        </ButtonGroup>
        <span className={'MuiLabel-amount'}>{this.props.ltp}</span>
        
      </ListItem>
    );
  }
}

export default withStyles(styles)(StockItem);
