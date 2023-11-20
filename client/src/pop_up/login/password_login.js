import "./password_login.css"

const PasswordLogin = props => {
    return (
        <div className="p-login-box">
            <div className='box'>
                <span className="close-icon" onClick={props.handleClose}>x</span>
                <div className='form-box'>
                    <div className='form-box-container'>
                        <div className='title'>
                            Please Login with password
                        </div>
                        <div className="caption">
                            You don't have an account? 
                            <a> Create an account</a>
                        </div>
                        <button className="other-btn">Login with face</button>
                        <div>or</div>
                        <form className="form">
                            <input placeholder="Please enter your email" type='text'/>
                            <input placeholder="Password" type='text'/>
                            <button className="login-btn">Login</button>
                        </form>
                    </div>
                </div>
                <div className="image-box"></div>
            </div>
        </div>
    );
}

export default PasswordLogin;