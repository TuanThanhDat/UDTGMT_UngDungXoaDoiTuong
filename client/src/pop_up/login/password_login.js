import "./password_login.css"
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import httpClient from '../../httpClient';
import FormInput from '../FormInput/FormInput';



const PasswordLogin = props => {

    const [values, setValues] = useState({
        name: '',
        password: ''
    })

    const onChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value});
    }

    const navigate = useNavigate();

    const handleLogin = async(e) => {
        e.preventDefault();
        try {
            const resp = await httpClient.post("//localhost:5000/api/v1/login", values);
            console.log(resp);
            props.handleClose();
            props.setIsLogin(true);
            navigate("/")
        } 
        catch(error) {
            if (error.response.status !== 200) {
                alert(error.response.data.message);
            }
        }
    }

    const changePopUp = (type) => {
        props.setType(type);
    }

    return (
        <div className="p-login-box">
            <div className='box'>
                <span className="close-icon" onClick={props.handleClose}>x</span>
                <div className='form-box'>
                    <div className='form-box-container'>
                        <div className='title'>
                            Please Login with password
                        </div>
                        <span className="caption" onClick={()=>{changePopUp("SignUp")}}>
                            You don't have an account? Create an account
                        </span>
                        <button className="other-btn" onClick={()=>{changePopUp("FaceLogin")}}>Login with face</button>
                        <div>or</div>
                        <form className="form">
                            <FormInput 
                                name='name' 
                                type='text' 
                                placeholder='Please enter your user name' 
                                onChange={onChange}
                                errorMessage='User name just contains character a-z,A-Z and 0-9. Its length must be larger than 5 and smaller than 10!!!' 
                                pattern="^[A-Za-z0-9]{5,30}$"
                                required={true}
                            />
                            <FormInput 
                                name='password' 
                                type='password' 
                                placeholder='Password' 
                                onChange={onChange}
                                errorMessage='Password is just contains number and its length must be larger thanh 5 and smaller than 10!!!'
                                pattern="^[0-9]{5,30}$"
                                required={true}
                            />
                            <button 
                                className="login-btn"
                                onClick={handleLogin}>
                                Login
                            </button>
                        </form>
                    </div>
                </div>
                <div className="image-box"></div>
            </div>
        </div>
    );
}

export default PasswordLogin;