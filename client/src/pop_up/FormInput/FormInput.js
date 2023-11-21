import './FormInput.css';
import {useState} from 'react';

const FormInput = (props) => {
    const [focused, setFocused] = useState(false);

    const handleFocus = (e) => {
        setFocused(true);
    };

    return (
        <div className='formInput'>
            <input name={props.name} 
                placeholder={props.placeholder} 
                type={props.type} 
                onChange={props.onChange}
                required={props.required}
                pattern={props.pattern}
                onBlur={handleFocus}
                focused={focused.toString()}/>
            <span>
                {props.errorMessage}
            </span>
        </div>
    );
};

export default FormInput;