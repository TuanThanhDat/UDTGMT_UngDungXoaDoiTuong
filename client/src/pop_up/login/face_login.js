
import "./face_login.css"

const FaceLogin = (props) => {
    return (
        <div className="f-login-box">
            <div className='box'>
                <span className="close-icon" onClick={props.handleClose}>x</span>
                <div clasName='content'>
                    Face Login
                </div>
            </div>
        </div>
    );
}

export default FaceLogin;