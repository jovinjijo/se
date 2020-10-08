import React, { Component } from 'react';
import {
  Accordion,
  AccordionActions,
  AccordionSummary,
  Button,
  createStyles,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Stock } from '@se/core';

const styles = (theme: Theme) =>
  createStyles({
    heading: {
      flexBasis: '100%',
    },
  });

interface HoldingItemProps extends WithStyles<typeof styles> {
  stock: Stock;
  quantity: number;
}

interface State {}

class HoldingItem extends Component<HoldingItemProps, State> {
  constructor(props: HoldingItemProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={this.props.classes.heading}>{this.props.stock}</Typography>
          <Typography>{this.props.quantity}</Typography>
        </AccordionSummary>
        <AccordionActions>
          <Button color="primary" variant="contained">
            Add
          </Button>
          <Button color="secondary" variant="contained">
            Exit
          </Button>
        </AccordionActions>
      </Accordion>
    );
  }
}

export default withStyles(styles)(HoldingItem);
