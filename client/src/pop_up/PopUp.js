import FaceLogin from "./login/face_login";
import PasswordLogin from "./login/password_login"
import SignUp from "./sign_up/sign_up";


const PopUp = (props) => {

    return (
        <>
            {
                (props.type == "PasswordLogin") && 
                <PasswordLogin 
                    setIsLogin={props.setIsLogin} 
                    handleClose={props.handleClose}
                    setType={props.setType}/>
            }
            {
                (props.type == "FaceLogin") && 
                <FaceLogin setIsLogin={props.setIsLogin} handleClose={props.handleClose} setType={props.setType}/>
            }
            {
                (props.type == "SignUp") && 
                <SignUp 
                    setIsLogin={props.setIsLogin} 
                    handleClose={props.handleClose}
                    setType={props.setType}/>
            }
        </>
    )
}

export default PopUp;