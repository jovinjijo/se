import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import Login from '../Login/Login';
import Signup from '../Signup/Signup';

interface Props {
  navigateToHome: () => void;
}

interface State {
  loginVisible: boolean;
}

class Landing extends Component<Props, State> {
  constructor(props: Props) {
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
          <Login toggleView={this.toggleLoginSignup} />
        </Grid>
        <Grid item hidden={loginVisible}>
          <Signup toggleView={this.toggleLoginSignup} />
        </Grid>
      </Grid>
    );
  }
}

export default Landing;
