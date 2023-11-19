import './Client.css';


import FaceLogin from './pages/face_login';
import PasswordLogin from './pages/password_login';
import SignUp from './pages/sign_up';
import Landing from './pages/landing';
import Edit from './pages/edit'
import TopNavigate from './navigate/top_navigate';
import SideNavigate from './navigate/side_navigate';


function Client() {
  return (
    <div className="Client">
        <Landing/>
        <FaceLogin/>
        <PasswordLogin/>
        <SignUp/>
        <Edit/>
        <TopNavigate/>
        <SideNavigate/>
    </div>
  );
}

export default Client;
