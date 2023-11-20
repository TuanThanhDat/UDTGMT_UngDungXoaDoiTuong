import './Client.css';
// import React, { useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Landing from './pages/landing/landing';

function Client() {

  return (
    <div className="Client">
        <BrowserRouter>
            <Routes>
              <Route path='/' element={<Landing/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default Client;
