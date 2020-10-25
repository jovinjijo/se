import React from 'react';
import { Container } from '@material-ui/core';
import Landing from './Landing/Landing';
import BusyIndicator from './utils/BusyIndicator';
import MessagePopup, { MessagePopupProps } from './utils/MessagePopup';
import Dashboard from './Dashboard/Dashboard';

export interface AppProps {
  showBusyIndicator: (enabled: boolean) => void;
  showMessagePopup: (messageType: 'success' | 'error', message: string) => void;
  login: (loggedIn: boolean) => void;
}

function App(): JSX.Element {
  const [busyIndicatorActive, setBusyIndicator] = React.useState(false);
  const [messagePopup, setMessagePopup] = React.useState<MessagePopupProps>({ open: false });
  const [loggedIn, setLoggedIn] = React.useState(false);

  const showBusyIndicator = (enabled: boolean) => {
    setBusyIndicator(enabled);
  };

  const showMessagePopup = (messageType: 'success' | 'error', message: string): void => {
    setMessagePopup({
      open: true,
      message: message,
      messageType: messageType,
    });
  };

  const hideMessagePopup = (): void => {
    setMessagePopup({ ...messagePopup, open: false });
  };

  const login = (loggedIn: boolean) => {
    setLoggedIn(loggedIn);
  };

  return (
    <Container style={{ height: '100vh' }}>
      <Landing {...{ showBusyIndicator, showMessagePopup, login }} hidden={loggedIn} />
      <Dashboard {...{ showBusyIndicator, showMessagePopup, login }} hidden={!loggedIn} />
      <BusyIndicator active={busyIndicatorActive} />
      <MessagePopup {...{ hideMessagePopup, ...messagePopup }} />
    </Container>
  );
}

export default App;
