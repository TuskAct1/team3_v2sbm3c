// src/components/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingButton from './FloatingButton';

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <FloatingButton />
    </>
  );
};

export default Layout;
