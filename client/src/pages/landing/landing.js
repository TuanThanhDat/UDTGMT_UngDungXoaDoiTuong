import "./landing.css";
// import {useState} from 'react';
// import { Outlet } from 'react-router-dom';
// import PasswordLogin from '../login/password_login';
// import PopUp from '../pop_up/PopUp';
import TopNavigate from '../../navigate/top_nav';


const Landing = () => {

    // const [isOpen, setIsOpen] = useState(false);
    // const [popupType, setPopupType] = useState()

    // const handleClick = (type) => {
    //     setPopupType(type);
    //     togglePopup();
    // }

    // const togglePopup = () => {
    //     setIsOpen(!isOpen);
    // }

    return (
        <div className='landing-box'>
            <TopNavigate isLogin={false}/>
            {/* {isOpen && <PopUp type={popupType} handleClose={togglePopup}/>}
            <button onClick={() => {handleClick("PasswordLogin")}}>
                Đăng nhập bằng mật khẩu
            </button>
            <button onClick={() => {handleClick("FaceLogin")}}>
                Đăng nhập bằng khuôn mặt
            </button> */}

        </div>
    )
}

export default Landing;