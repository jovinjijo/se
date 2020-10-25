import React, { Component } from 'react';
import { createStyles, Grid, MenuItem, Select, Theme, WithStyles, withStyles } from '@material-ui/core';
import OrdersTable from './OrdersTable/OrdersTable';
import { OrderStoreDetails } from '@se/api';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
      flexFlow: 'column',
      marginTop: theme.spacing(2),
    },
    marginLeftRight: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  });

interface Props extends WithStyles<typeof styles> {
  orders: OrderStoreDetails;
}
export type OrderView = 'Placed' | 'Confirmed';

interface State {
  selectedView: OrderView;
}

class Orders extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedView: 'Placed',
    };
  }

  setSelectedView(selectedView: OrderView): void {
    this.setState({
      ...this.state,
      selectedView: selectedView,
    });
  }

  handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    this.setSelectedView(event.target.value as OrderView);
  };

  render() {
    const { selectedView } = this.state;
    const { orders } = this.props;
    return (
      <Grid container direction="column" className={this.props.classes.root}>
        <Grid item className={this.props.classes.marginLeftRight}>
          <Select value={selectedView} onChange={this.handleChange}>
            <MenuItem value="Placed">Placed</MenuItem>
            <MenuItem value="Confirmed">Confirmed</MenuItem>
          </Select>
        </Grid>
        <Grid item style={{ flexBasis: '70%' }} className={this.props.classes.marginLeftRight}>
          <OrdersTable {...{ orders, selectedView }} />
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Orders);
