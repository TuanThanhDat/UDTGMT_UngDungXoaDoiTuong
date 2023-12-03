
import './sign_up.css';
import '../../httpClient';
import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import httpClient from '../../httpClient';
import FormInput from '../FormInput/FormInput';


const SignUp = (props) => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        confirm: ''
    });

    const onChange = (e) => {
        e.preventDefault();
        setValues({...values, [e.target.name]: e.target.value});
    };

    useEffect(() => {
        console.log(values); // This will log the updated 'values' whenever it changes.
    }, [values]); // This useEffect will run whenever 'values' changes.

    const navigate = useNavigate();

    const handleSignUp = async(e) => {
        e.preventDefault();
        if (!/^[A-Za-z0-9]{5,30}$/i.test(values["name"])){
            alert("Invalided user name !!!");
        }
        else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(values["email"])) {
            alert("Invalided email !!!");
        }
        else if (!/^[0-9]{5,30}$/i.test(values["password"])) {
            alert("Invalided password !!!");
        }
        else {
            try {
                const data = new FormData();
                data.append("name",values["name"]);
                data.append("email",values["email"]);
                data.append("password",values["password"]);

                const resp = await httpClient.post("//localhost:5000/api/v1/signup", values);
                console.log(resp);
                props.setIsLogin(true);
                props.setUserName(resp.data.user_name);
                props.setUserToken(resp.data.user_token);
                props.handleClose();
                navigate("/")
            } 
            catch(error) {
                if (error.response.status !== 200) {
                    alert(error.response.data.message);
                }
            }
        }
    };

    const changePopUp = (type) => {
        props.setType(type);
    };

    const passwordMatchError = values.password !== values.confirm ? 'Passwords do not match' : '';

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
                                errorMessage='User name just contains character a-z,A-Z and 0-9. Its length must be larger than 5 and smaller than 10!!!' 
                                pattern="^[A-Za-z0-9]{5,30}$"
                                required={true}
                            />
                            <FormInput 
                                name='email' 
                                type='email' 
                                placeholder='Please enter your email' 
                                onChange={onChange}
                                errorMessage='Not found email!!!' 
                                pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                                required={true}
                            />
                            <FormInput 
                                name='password' 
                                // type='password' 
                                placeholder='Password' 
                                onChange={onChange}
                                errorMessage='Password is just contains number and its length must be larger thanh 5 and smaller than 10!!!'
                                pattern="^[0-9]{5,30}$"
                                value={values.password}
                                required={true}
                            />
                            <FormInput 
                                name='confirm' 
                                // type='password' 
                                placeholder='Confirm your password' 
                                onChange={onChange}
                                errorMessage={passwordMatchError}
                                pattern={values.password}
                                value={values.confirm}
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