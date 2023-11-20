import FaceLogin from "./login/face_login";
import PasswordLogin from "./login/password_login"
import SignUp from "./sign_up/sign_up";


const PopUp = (props) => {
    return (
        <>
            {(props.type == "PasswordLogin") && <PasswordLogin handleClose={props.handleClose}/>}
            {(props.type == "FaceLogin") && <FaceLogin handleClose={props.handleClose}/>}
            {(props.type == "SignUp") && <SignUp handleClose={props.handleClose}/>}
        </>
    )
}

export default PopUp;