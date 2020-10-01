import React, { Component } from 'react';
import { Box, Typography, TextField, Button, withStyles, Theme, createStyles, WithStyles } from '@material-ui/core';
import { apiCall, getErrorMessage, sampleHoldings } from '../utils/Util';
import { Amount, HoldingsData } from '@se/core';
import { LandingProps } from '../Landing/Landing';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(2),
      },
      textAlign: 'center',
    },
  });

interface Props extends WithStyles<typeof styles>, LandingProps {
  toggleView: () => void;
}

interface State {
  username: string;
  password: string;
  balance: Amount;
  holdings: HoldingsData;
}

class Signup extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      balance: 0,
      holdings: sampleHoldings,
    };
  }

  handleSignup = async () => {
    this.props.showBusyIndicator(true);
    const payload = {
      username: this.state.username,
      password: this.state.password,
      balance: this.state.balance,
      holdings: this.state.holdings,
    };
    try {
      const response = await apiCall('/v1/user/signup', 'POST', payload);
      const error = getErrorMessage(response);
      if (error) {
        this.props.showMessagePopup('error', error);
      } else {
        this.props.navigateToHome();
      }
    } catch (ex) {
      this.props.showMessagePopup('error', ex.message);
    } finally {
      this.props.showBusyIndicator(false);
    }
  };

  handleNavigateLogin = () => {
    this.props.toggleView();
  };

  render() {
    return (
      <Box className={this.props.classes.root}>
        <Typography variant="h4" component="h1">
          Signup
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
            this.setState({ username: e.currentTarget.value });
          }}
        />
        <br />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
            this.setState({ password: e.currentTarget.value });
          }}
        />
        <br />
        <TextField
          label="Balance"
          variant="outlined"
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
            this.setState({ balance: parseFloat(e.currentTarget.value) });
          }}
        />
        <br />
        <Button variant="contained" color="primary" onClick={this.handleSignup}>
          Signup
        </Button>
        <br />
        <Button variant="contained" color="default" onClick={this.handleNavigateLogin}>
          Already a user? Login
        </Button>
      </Box>
    );
  }
}

export default withStyles(styles)(Signup);
