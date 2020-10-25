import React, { Component } from 'react';
import { Card, CardContent, createStyles, Grid, Theme, WithStyles, withStyles } from '@material-ui/core';
import { UserStoreItemDetails } from '@se/api';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(2),
    },
  });

interface Props extends WithStyles<typeof styles> {
  wallet: UserStoreItemDetails['wallet'];
}
class Funds extends Component<Props> {
  render() {
    return (
      <Grid container direction="column">
        <Grid item>
          <Card className={this.props.classes.root}>
            <CardContent>Balance: {this.props.wallet.margin}</CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Funds);
