import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import TableComponent from './components/TableComponent';
import PopUp from './components/PopUp';
function App() {
  return (
    <Container>
      <ResponsiveAppBar/>
      <TableComponent/>
      <PopUp/>
    </Container>
  );
}

export default App;