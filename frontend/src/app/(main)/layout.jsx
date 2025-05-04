'use client'
import React from 'react'
import Navbar from '../Navbar';
import { AppProvider } from '@/context/AppContext';

const Layout = ({ children }) => {
    return (
        <AppProvider>
          <div>
            {children}
          </div>
        </AppProvider>
    )
}

export default Layout;