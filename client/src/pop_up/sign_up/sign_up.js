
import './sign_up.css';

const SignUp = (props) => {
    return (
        <div className="sign-up-box">
            <div className='box'>
                <span className="close-icon" onClick={props.handleClose}>x</span>
                <div className='form-box'>
                    <div className='form-box-container'>
                        <div className='title'>
                            Sign up with email for free
                        </div>
                        <div className="caption">
                            Already have an account? 
                            <a> Login</a>
                        </div>
                        {/* <button className="other-btn">Login with face</button>
                        <div>or</div> */}
                        <form className="form">
                            <input placeholder="Please enter your email" type='text'/>
                            <input placeholder="Password" type='text'/>
                            <input placeholder="Confirm password" type='text'/>
                            <button className="sign-up-btn">Sign up</button>
                        </form>
                    </div>
                </div>
                <div className="image-box"></div>
            </div>
        </div>
    );
}

export default SignUp;