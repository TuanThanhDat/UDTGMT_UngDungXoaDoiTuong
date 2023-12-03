import FaceLogin from "./login/face_login";
import PasswordLogin from "./login/password_login"
import SignUp from "./sign_up/sign_up";
import FaceSignUp from "./face_sign_up/FaceSignUp";

const PopUp = (props) => {

    return (
        <>
            {
                (props.type == "PasswordLogin") && 
                <PasswordLogin 
                    setIsLogin={props.setIsLogin} 
                    handleClose={props.handleClose}
                    setType={props.setType}
                    setUserName={props.setUserName}
                    setUserToken={props.setUserToken}/>
            }
            {
                (props.type == "FaceLogin") && 
                <FaceLogin 
                    setIsLogin={props.setIsLogin} 
                    handleClose={props.handleClose} 
                    setType={props.setType}
                    setUserName={props.setUserName}
                    setUserToken={props.setUserToken}/>
            }
            {
                (props.type == "SignUp") && 
                <SignUp 
                    setIsLogin={props.setIsLogin} 
                    handleClose={props.handleClose}
                    setType={props.setType}
                    setUserName={props.setUserName}
                    setUserToken={props.setUserToken}/>
            }
            {
                (props.type == "FaceSignUp") && 
                <FaceSignUp 
                    handleClose={props.handleClose}
                    setType={props.setType}
                    userName={props.userName}
                    userToken={props.userToken}/>
            }
        </>
    )
}

export default PopUp;