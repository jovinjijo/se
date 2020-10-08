import React, { Component } from 'react';
import { createStyles, Divider, Grid, Theme, withStyles, WithStyles, Zoom } from '@material-ui/core';
import { AppProps } from '../App';
import Bar from '../Bar/Bar';
import ListOfStocks from './ListOfStocks/ListOfStocks';
import DetailView from './DetailView/DetailView';
import { UserStoreItemDetails } from '@se/api';
import { apiCall, getErrorMessage } from '../utils/Util';

const styles = (theme: Theme) => createStyles({});

interface DashboardProps extends WithStyles<typeof styles>, AppProps {
  hidden: boolean;
}

interface State {
  user: UserStoreItemDetails;
}

class Dashboard extends Component<DashboardProps, State> {
  constructor(props: DashboardProps) {
    super(props);
    this.state = {
      user: {
        holdings: {},
        id: 0,
        orders: { placedBuyOrders: [], confirmedOrders: [], placedSellOrders: [] },
        username: '',
        wallet: { margin: 0 },
      },
    };
  }

  fetchUserDetails = async () => {
    this.props.showBusyIndicator(true);
    try {
      const response = await apiCall('/v1/user/check', 'GET');
      const error = getErrorMessage(response);
      if (!error) {
        this.setState({
          ...this.state,
          user: response.data,
        });
      }
    } catch (ex) {
      this.props.showMessagePopup('error', ex.message);
    } finally {
      this.props.showBusyIndicator(false);
    }
  };

  async componentDidUpdate(prevProps: DashboardProps) {
    if (this.props.hidden !== prevProps.hidden) {
      this.fetchUserDetails();
    }
  }

  render() {
    const { hidden } = this.props;
    const { user } = this.state;
    return (
      <Zoom in={!hidden} style={{ height: '100vh' }}>
        <Grid container direction="column">
          <Grid item>
            <Bar />
          </Grid>
          <Grid item style={{ height: '93%' }}>
            <Grid container direction="row" style={{ height: '100%', justifyContent: 'space-around' }}>
              <Grid item>
                <Divider orientation="vertical" />
              </Grid>
              <Grid item style={{ width: '30%' }}>
                <ListOfStocks {...this.props} />
              </Grid>
              <Divider orientation="vertical" />
              <Grid item style={{ width: '69%' }}>
                <DetailView {...{ user }} />
              </Grid>
              <Grid item>
                <Divider orientation="vertical" />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Divider />
          </Grid>
        </Grid>
      </Zoom>
    );
  }
}

export default withStyles(styles)(Dashboard);
