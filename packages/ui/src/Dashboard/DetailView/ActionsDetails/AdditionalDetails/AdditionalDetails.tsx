import React, { Component } from 'react';
import { createStyles, Tab, Tabs, Theme, WithStyles, withStyles } from '@material-ui/core';
import Orders from './Orders/Orders';
import Holdings from './Holdings/Holdings';
import Funds from './Funds/Funds';
import { DetailViewProps } from '../../DetailView';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
      height: '100%',
    },
  });

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  style?: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <span role="tabpanel" hidden={value !== index} {...other}>
      {children}
    </span>
  );
}

interface AdditionalDetailsProps extends WithStyles<typeof styles>, Pick<DetailViewProps, 'user' | 'updateSelectedStock' | 'updateSelectedOrderType'> {}

interface State {
  selectedScreen: number;
}

class AdditionalDetails extends Component<AdditionalDetailsProps, State> {
  constructor(props: AdditionalDetailsProps) {
    super(props);
    this.state = {
      selectedScreen: 0,
    };
  }

  handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    this.setState({
      ...this.state,
      selectedScreen: newValue,
    });
  };

  render() {
    const { wallet, holdings, orders } = this.props.user;
    const { selectedScreen } = this.state;
    const { updateSelectedStock, updateSelectedOrderType } = this.props;
    return (
      <div className={this.props.classes.root}>
        <Tabs value={selectedScreen} onChange={this.handleChange} indicatorColor="primary" variant="fullWidth">
          <Tab label="Orders" />
          <Tab label="Holdings" />
          <Tab label="Funds" />
        </Tabs>
        <TabPanel value={selectedScreen} index={0} style={{ }}>
          <Orders {...{ orders }} />
        </TabPanel>
        <TabPanel value={selectedScreen} index={1}>
          <Holdings {...{ holdings, updateSelectedStock, updateSelectedOrderType }} />
        </TabPanel>
        <TabPanel value={selectedScreen} index={2}>
          <Funds {...{ wallet }} />
        </TabPanel>
      </div>
    );
  }
}

export default withStyles(styles)(AdditionalDetails);
