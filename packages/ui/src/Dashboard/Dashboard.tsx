import React, { Component } from 'react';
import { createStyles, Divider, Grid, withStyles, WithStyles, Zoom } from '@material-ui/core';
import { AppProps } from '../App';
import Bar from '../Bar/Bar';
import ListOfStocks from './ListOfStocks/ListOfStocks';
import DetailView from './DetailView/DetailView';
import { UserDetails, UserStoreItemDetails } from '@se/api';
import { apiCall, getErrorMessage } from '../utils/Util';
import { Stock, OrderType, LtpMap, Amount, TradeTick } from '@se/core';
import { SocketClient } from '../utils/SocketClient';
import { UserResponse } from '@se/api';

const styles = () => createStyles({});

interface DashboardProps extends WithStyles<typeof styles>, AppProps {
  hidden: boolean;
}

interface State {
  user: UserStoreItemDetails;
  selectedStock?: Stock;
  selectedStockTickData?: TradeTick[];
  selectedOrderType: OrderType;
  socket?: SocketClient;
  ltpMap: Partial<Record<Stock, Amount>>;
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
      ltpMap: {},
      selectedOrderType: OrderType.Buy,
    };
  }

  fetchUserDetails = async () => {
    this.props.showBusyIndicator(true);
    try {
      const response = await apiCall('/v1/user/check', 'GET');
      const error = getErrorMessage(response);
      const userResponse = response as UserResponse;
      if (!error) {
        this.setState({
          ...this.state,
          user: userResponse.data,
        });
      }
    } catch (ex) {
      this.props.showMessagePopup('error', ex.message);
    } finally {
      this.props.showBusyIndicator(false);
    }
  };

  updateSelectedStock = async (selectedStock: Stock) => {
    if (this.state.selectedStock !== selectedStock) {
      setTimeout(() => {
        this.setState({ ...this.state, selectedStock });
      }, 10);
      this.setState({
        ...this.state,
        selectedStockTickData: await this.state.socket?.getTickData(selectedStock),
      });
    }
  };

  updateSelectedOrderType = (selectedOrderType: OrderType) => {
    this.setState({ ...this.state, selectedOrderType });
  };

  updateLtp(ltpMap: LtpMap): void {
    this.setState({ ...this.state, ltpMap: { ...this.state.ltpMap, ...ltpMap } });
  }

  updateUserDetails(user: Partial<UserDetails>): void {
    this.setState({ ...this.state, user: { ...this.state.user, ...user } });
  }

  async componentDidUpdate(prevProps: DashboardProps) {
    if (this.props.hidden === prevProps.hidden) {
      return;
    }
    if (!this.props.hidden) {
      await this.fetchUserDetails();
      this.setState({
        ...this.state,
        socket: new SocketClient(this.updateUserDetails.bind(this), this.updateLtp.bind(this)),
      });
    } else {
      this.state.socket?.disconnect();
      this.setState({
        ...this.state,
        socket: undefined,
      });
    }
  }

  render() {
    const { hidden } = this.props;
    const { user, selectedOrderType, selectedStock, ltpMap } = this.state;
    const { updateSelectedStock, updateSelectedOrderType, fetchUserDetails } = this;
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
              <Grid item style={{ width: '27%' }}>
                <ListOfStocks {...{ updateSelectedStock, updateSelectedOrderType, ltpMap, ...this.props }} />
              </Grid>
              <Divider orientation="vertical" />
              <Grid item style={{ width: '72%' }}>
                <DetailView
                  {...{
                    user,
                    selectedOrderType,
                    selectedStock,
                    updateSelectedStock,
                    updateSelectedOrderType,
                    fetchUserDetails,
                    ...this.props,
                  }}
                />
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
