import React, { createContext, useContext, useState, useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

const SnackbarProvider = ({ children }) => {
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
    severity: 'success', // or 'error', 'warning', 'info'
  });

  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbarState({
      open: true,
      message,
      severity,
    });
  }, []);

  const handleClose = () => {
    setSnackbarState({
      ...snackbarState,
      open: false,
    });
  };

  return (
    <SnackbarContext.Provider value={showSnackbar}>
      {children}
      <Snackbar
        open={snackbarState.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}  
      >
        <MuiAlert
          onClose={handleClose}
          severity={snackbarState.severity}
          elevation={6}
          variant="filled"
        >
          {snackbarState.message}
        </MuiAlert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export default SnackbarProvider;
