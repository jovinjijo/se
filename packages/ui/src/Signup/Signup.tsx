import React, { Component } from 'react';
import { Box, Typography, TextField, Button, withStyles, Theme, createStyles, WithStyles } from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(2),
      },
      textAlign: 'center',
    },
  });

interface Props extends WithStyles<typeof styles> {
  toggleView: () => void;
}

interface State {
  username: string;
  password: string;
}

class Signup extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  handleSignup = () => {
    console.log(this.state.username);
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
          id="username"
          label="Username"
          variant="outlined"
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
            this.setState({ username: e.currentTarget.value });
          }}
        />
        <br />
        <TextField
          id="password"
          label="Password"
          variant="outlined"
          type="password"
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
            this.setState({ password: e.currentTarget.value });
          }}
        />
        <br />
        <Button variant="contained" color="primary" onClick={this.handleSignup}>
          Signup
        </Button>
        <br />
        <Button variant="contained" color="secondary" onClick={this.handleNavigateLogin}>
          Already a user? Login
        </Button>
      </Box>
    );
  }
}

export default withStyles(styles)(Signup);
