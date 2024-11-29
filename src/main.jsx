import React from 'react';
import App from './App';
import { createRoot } from 'react-dom/client'
import theme from './theme';
import { ThemeProvider } from '@mui/material/styles';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
</React.StrictMode>
)
