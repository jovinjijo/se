import React, { Component } from 'react';
import { Box, Typography, TextField, Button, withStyles, Theme, createStyles, WithStyles } from '@material-ui/core';
import { LandingProps } from '../Landing';
import { apiCall, getErrorMessage } from '../../utils/Util';

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
  toggleLoginSignup: () => void;
}

interface State {
  username: string;
  password: string;
}

class Login extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  handleLogin = async () => {
    this.props.showBusyIndicator(true);
    const payload = {
      username: this.state.username,
      password: this.state.password,
    };
    try {
      const response = await apiCall('/v1/user/login', 'POST', payload);
      const error = getErrorMessage(response);
      if (error) {
        this.props.showMessagePopup('error', error);
      } else {
        this.props.login(true);
      }
    } catch (ex) {
      this.props.showMessagePopup('error', ex.message);
    } finally {
      this.props.showBusyIndicator(false);
    }
  };

  render() {
    return (
      <Box className={this.props.classes.root}>
        <Typography variant="h4" component="h1">
          Login
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
        <Button variant="contained" color="primary" onClick={this.handleLogin}>
          Login
        </Button>
        <br />
        <Button variant="contained" color="default" onClick={this.props.toggleLoginSignup}>
          New user? Signup
        </Button>
      </Box>
    );
  }
}

export default withStyles(styles)(Login);
