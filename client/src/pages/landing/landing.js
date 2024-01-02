import "./landing.css";
// import {useState} from 'react';
// import { Outlet } from 'react-router-dom';
// import PasswordLogin from '../login/password_login';
// import PopUp from '../pop_up/PopUp';
import TopNavigate from '../../navigate/top_nav';

const Landing = (props) => {
    return (
        <div className='landing-box'>
            <TopNavigate 
                isLogin={props.isLogin} 
                setIsLogin={props.setIsLogin}
                userName={props.userName}
                userToken={props.userToken}
                setUserName={props.setUserName}
                setUserToken={props.setUserToken}
                serverURL={props.serverURL}/>
            {/* <WebcamFaceDetectionComponent/> */}
        </div>
    )
}

export default Landing;