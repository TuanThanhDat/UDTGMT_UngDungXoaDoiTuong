
import './sign_up.css';
import '../../httpClient';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import httpClient from '../../httpClient';
import FormInput from '../FormInput/FormInput';


const SignUp = (props) => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: ''
    })

    const onChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value});
    }

    const navigate = useNavigate();

    const handleSignUp = async(e) => {
        e.preventDefault();
        try {
            const resp = await httpClient.post("//localhost:5000/api/v1/signup", values);
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
        <div className="sign-up-box">
            <div className='box'>
                <span className="close-icon" onClick={props.handleClose}>x</span>
                <div className='form-box'>
                    <div className='form-box-container'>
                        <div className='title'>
                            Sign up with email for free
                        </div>
                        <span className="caption" onClick={()=>{changePopUp("PasswordLogin")}}>
                            Already have an account? Login
                        </span>
                        <form className="form">
                            <FormInput 
                                name='name' 
                                type='text' 
                                placeholder='Please enter your user name' 
                                onChange={onChange}
                                errorMessage='' 
                                pattern="^[A-Za-z0-9]{5,30}$"
                                required={true}
                            />
                            <FormInput 
                                name='email' 
                                type='email' 
                                placeholder='Please enter your email' 
                                onChange={onChange}
                                errorMessage='' 
                                pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                                required={true}
                            />
                            <FormInput 
                                name='password' 
                                type='password' 
                                placeholder='Password' 
                                onChange={onChange}
                                errorMessage=''
                                pattern="^[0-9]{5,30}$"
                                required={true}
                            />
                            <FormInput 
                                name='confirm' 
                                type='password' 
                                placeholder='Confirm your password' 
                                onChange={onChange}
                                errorMessage=''
                                pattern={values.password}
                                required={true}
                            />
                            <button 
                                className="sign-up-btn"
                                onClick={handleSignUp}>
                                Sign up
                            </button>
                        </form>
                    </div>
                </div>
                <div className="image-box"></div>
            </div>
        </div>
    );
}

export default SignUp;