    import './top_nav.css';
    import {useState} from 'react';
    import PopUp from '../pop_up/PopUp';

    const NavButton = (props) => {
    if (props.show){
        return (
        <button className='nav-btn' onClick={props.onClick}>
            {props.name}
        </button>
        )
    }
    }

    const UserButton = (props) => {
    if (props.show) {
        return (
        <button className='user-btn'>
            {props.name}
        </button>
        )
    }
    }

    const TopNavigate = (props) => {
    // POP UP =====================================
    const [isOpen, setIsOpen] = useState(false);
    const [popupType, setPopupType] = useState('')
    const handleClick = (type) => {
        if (type === "LogOut") {
            props.setIsLogin(false);
        }
        else {
            setPopupType(type);
            togglePopup();
        }
    }
    const togglePopup = () => {
        setIsOpen(!isOpen);
    }
    // ============================================

    return (
        <div>
            {isOpen && <PopUp 
                        type={popupType} 
                        setType={setPopupType} 
                        handleClose={togglePopup} 
                        setIsLogin={props.setIsLogin}
                        userName={props.userName}
                        userToken={props.userToken}
                        setUserName={props.setUserName}
                        setUserToken={props.setUserToken}/>}
            <div className='top-nav'>
            <div className='top-nav-dropdown'>
                <div className='dropdown'>
                Photo Editing Tools
                </div>
                <div className='dropdown'>
                AI Tools
                </div>
                <div className='dropdown'>
                About
                </div>
            </div>
            <div className='top-nav-btn-box'>
                <NavButton name={"Login"} show={!props.isLogin} onClick={() => {handleClick("PasswordLogin")}}/>
                <NavButton name={"Sign up"} show={!props.isLogin} onClick={() => {handleClick("SignUp")}}/>
                <NavButton name={"Face sign up"} show={props.isLogin} onClick={() => {handleClick("FaceSignUp")}}/>
                <NavButton name={"Log out"} show={props.isLogin} onClick={() => {handleClick("LogOut")}}/>
            </div>
                <div className='top-nav-user'>
                    <UserButton name={''} show={props.isLogin}/>
                </div>
            </div>
        </div>
    )
    }

    export default TopNavigate;