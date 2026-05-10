import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar';
import AppRouter from './routers/appRouter.jsx';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRouter />
    </BrowserRouter>
  );
};

export default App;
