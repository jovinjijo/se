import React, { Component } from 'react';
import { Backdrop, createStyles, Theme, CircularProgress, WithStyles, withStyles } from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  });

interface Props extends WithStyles<typeof styles> {
  active: boolean;
}

export class BusyIndicator extends Component<Props> {
  render() {
    return (
      <Backdrop className={this.props.classes.backdrop} open={this.props.active}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
}

export default withStyles(styles)(BusyIndicator);
