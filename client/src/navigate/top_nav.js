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

const TopNavigate = (props) => {
  // POP UP =====================================
  const [isOpen, setIsOpen] = useState(false);
  const [popupType, setPopupType] = useState()
  const handleClick = (type) => {
      setPopupType(type);
      togglePopup();
  }
  const togglePopup = () => {
      setIsOpen(!isOpen);
  }
  // ============================================

  return (
    <div>
        {isOpen && <PopUp type={popupType} handleClose={togglePopup}/>}
        <div className='top-nav'>
          <div className='top-nav-dropdown'>
          </div>
          <div className='top-nav-btn-box'>
            <NavButton name={"Login"} show={!props.isLogin} onClick={() => {handleClick("PasswordLogin")}}/>
            <NavButton name={"Sign up"} show={!props.isLogin} onClick={() => {handleClick("SignUp")}}/>
          </div>
        </div>
    </div>
  )
}

export default TopNavigate;