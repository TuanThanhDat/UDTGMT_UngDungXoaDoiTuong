import './Client.css';
import React, { useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Landing from './pages/landing/landing';

function Client() {

  const [userID, setUserID] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="Client">
        <BrowserRouter>
            <Routes>
              <Route path='/' element={<Landing isLogin={isLogin} setIsLogin={setIsLogin}/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default Client;
