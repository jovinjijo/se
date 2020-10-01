import React from 'react';
import { Container } from '@material-ui/core';
import Landing from './Landing/Landing';
import BusyIndicator from './utils/BusyIndicator';
import MessagePopup, { MessagePopupProps } from './utils/MessagePopup';

export interface AppProps {
  showBusyIndicator: (enabled: boolean) => void;
  showMessagePopup: (messageType: 'success' | 'error', message: string) => void;
}

function App() {
  const [busyIndicatorActive, setBusyIndicator] = React.useState(false);
  const [messagePopup, setMessagePopup] = React.useState<MessagePopupProps>({ open: false });

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

  const navigateToHome = () => {
    showMessagePopup('success', "Login Successful")
    return null;
  };

  return (
    <Container maxWidth="sm">
      <Landing navigateToHome={navigateToHome} {...{ showBusyIndicator, showMessagePopup }} />
      <BusyIndicator active={busyIndicatorActive} />
      <MessagePopup {...{ hideMessagePopup, ...messagePopup }} />
    </Container>
  );
}

export default App;
