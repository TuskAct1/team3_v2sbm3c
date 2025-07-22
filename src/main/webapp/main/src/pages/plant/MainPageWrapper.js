import React from 'react';
import MainPage from './MainPage';
import { PointProvider } from './PointContext';

const MainPageWrapper = () => {
  const memberno = localStorage.getItem('memberno');
  return (
    <PointProvider memberno={memberno}>
      <MainPage />
    </PointProvider>
  );
};

export default MainPageWrapper;
