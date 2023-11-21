import "./landing.css";
// import {useState} from 'react';
// import { Outlet } from 'react-router-dom';
// import PasswordLogin from '../login/password_login';
// import PopUp from '../pop_up/PopUp';
import TopNavigate from '../../navigate/top_nav';


const Landing = (props) => {

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
            <TopNavigate isLogin={props.isLogin} setIsLogin={props.setIsLogin}/>
        </div>
    )
}

export default Landing;