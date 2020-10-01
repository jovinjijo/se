import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles, Theme } from '@material-ui/core/styles';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export type MessagePopupType = 'success' | 'error';

export interface MessagePopupProps {
  messageType?: MessagePopupType;
  message?: string;
  open: boolean;
}

type HideMessagePopup = { hideMessagePopup: () => void };

export default function MessagePopup(props: MessagePopupProps & HideMessagePopup) {
  const classes = useStyles();

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    props.hideMessagePopup();
  };

  return (
    <div className={classes.root}>
      <Snackbar open={props.open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={props.messageType}>
          {props.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
