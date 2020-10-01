import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import Login from '../Login/Login';
import Signup from '../Signup/Signup';
import { AppProps } from '../App';

export interface LandingProps extends AppProps {
  navigateToHome: () => void;
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
  }

  toggleLoginSignup = () => {
    this.setState({
      loginVisible: !this.state.loginVisible,
    });
  };

  render() {
    const { loginVisible } = this.state;
    return (
      <Grid container spacing={2} direction="row" alignItems="center" justify="center" style={{ minHeight: '100vh' }}>
        <Grid item hidden={!loginVisible}>
          <Login toggleView={this.toggleLoginSignup} {...this.props} />
        </Grid>
        <Grid item hidden={loginVisible}>
          <Signup toggleView={this.toggleLoginSignup} {...this.props} />
        </Grid>
      </Grid>
    );
  }
}

export default Landing;
