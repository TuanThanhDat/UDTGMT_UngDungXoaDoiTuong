import './Client.css';
import React, { useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Landing from './pages/landing/landing';
import WebcamToCanvas from './pages/landing/webcam';

function Client() {

    const [userName, setUserName] = useState(null);
    const [userToken, setUserToken] = useState(null);
    const [isLogin, setIsLogin] = useState(false);

    return (
        <div className="Client">
            <BrowserRouter>
                <Routes>
                {/* <Route path='/' element={<WebcamToCanvas/>}/> */}
                <Route path='/' 
                    element={<Landing 
                            isLogin={isLogin} 
                            setIsLogin={setIsLogin}
                            userName={userName}
                            userToken={userToken}
                            setUserName={setUserName}
                            setUserToken={setUserToken}/>}
                />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default Client;
