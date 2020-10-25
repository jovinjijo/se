import React, { Component } from 'react';
import { Grid, Zoom } from '@material-ui/core';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import { AppProps } from '../App';
import { apiCall, getErrorMessage } from '../utils/Util';

export interface LandingProps extends AppProps {
  hidden: boolean;
}

interface State {
  loginVisible: boolean;
}

class Landing extends Component<LandingProps, State> {
  constructor(props: LandingProps) {
    super(props);
    this.state = {
      loginVisible: true,
    };
    this.checkLogin();
  }

  checkLogin = async (): Promise<void> => {
    this.props.showBusyIndicator(true);
    try {
      const response = await apiCall('/v1/user/check', 'GET');
      const error = getErrorMessage(response);
      if (!error) {
        this.props.login(true);
      }
    } catch (ex) {
      this.props.showMessagePopup('error', ex.message);
    } finally {
      this.props.showBusyIndicator(false);
    }
  };

  toggleLoginSignup = (): void => {
    this.setState({
      loginVisible: !this.state.loginVisible,
    });
  };

  render(): JSX.Element {
    const { loginVisible } = this.state;
    const { toggleLoginSignup } = this;
    const { hidden } = this.props;
    return (
      <Zoom in={!hidden}>
        <div style={{ height: hidden ? '0px' : '100vh', overflow: 'hidden' }}>
          <Grid
            container
            spacing={2}
            direction="row"
            alignItems="center"
            justify="center"
            style={{ minHeight: '100vh' }}
          >
            <Grid item hidden={!loginVisible}>
              <Login {...{ toggleLoginSignup, ...this.props }} />
            </Grid>
            <Grid item hidden={loginVisible}>
              <Signup {...{ toggleLoginSignup, ...this.props }} />
            </Grid>
          </Grid>
        </div>
      </Zoom>
    );
  }
}

export default Landing;
