import './Client.css';
import React, { useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Landing from './pages/landing/landing';
import Editor from './pages/edit/Editor';
import Dev from './pages/dev/Dev';


function Client() {
    const serverURL = "//localhost:5000";
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
                            setUserToken={setUserToken}
                            serverURL={serverURL}/>}
                />
                <Route path='/editor' 
                    element={<Editor 
                        isLogin={isLogin} 
                        setIsLogin={setIsLogin}
                        userName={userName}
                        userToken={userToken}
                        setUserName={setUserName}
                        setUserToken={setUserToken}
                        serverURL={serverURL}/>}
                />
                <Route path='/dev' 
                    element={<Dev/>}
                />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default Client;
