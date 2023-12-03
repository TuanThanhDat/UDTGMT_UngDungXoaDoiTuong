import "./face_login.css"
import React, {useState, useRef, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import httpClient from '../../httpClient';
import FormInput from '../FormInput/FormInput';

import * as faceapi from 'face-api.js';

const FaceLogin = (props) => {
    // const [selectedImage, setSelectedImage] = useState();
    // const [isImagePicked, setIsImagePicked] = useState(false);
    // const [isInputValid, setIsInputValid] = useState(false);
    // const [isImageValid, setIsImageValid] = useState(false);

    const [values, setValues] = useState({
        name: '',
    })

    const onChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value});
    }

    const navigate = useNavigate();

    const changePopUp = (type) => {
        props.setType(type);
    }

    // const startDrawing = () => {
    //     const drawVideo = () => {
    //         const video = videoRef.current;
    //         const canvas = canvasRef.current;
    //         if (video && canvas) {
    //             const context = canvas.getContext('2d');
    //             context.drawImage(video, 0, 0, canvas.width, canvas.height);
    //         }
    //     animationFrameId = requestAnimationFrame(drawVideo);
    //     };
    //     drawVideo();
    // };

    //   ===================================================================
    const HEIGHT = 444;
    const WIDTH = 474;
    
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    let animationFrameId = null;

    const [isStreaming, setIsStreaming] = useState(false);
    // const [detectedFaces, setDetectedFaces] = useState([]);

    const loadModel = async() => {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        // await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    };

    const startVideo = async () => {
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    // videoRef.current.play();
                    detectFaces();
                }
            })
            .catch((err) => {
                console.error('Error accessing the camera:', err);
            });
        }
    };

    const detectFaces = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
    
        if (video && canvas) {
            const displaySize = { width: video.width, height: video.height };
            faceapi.matchDimensions(canvas, displaySize);
    
            setInterval(async () => {
                const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
                
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw video frame on canvas
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                if (detections.length===1) {
                    const data = new FormData();
                    data.append("image", canvas.toDataURL('image/jpeg'));
                    data.append("user_name", values["name"]);
                    handleLogin(data);
                }

                // Draw bounding boxes around detected faces
                ctx.fillStyle = 'red';
                ctx.strokeStyle = 'green';
                ctx.lineWidth = 3;
                resizedDetections.forEach(detection => {
                    const { x, y, width, height } = detection.box;
                    ctx.strokeRect(x, y, width, height);
                });
            }, 50); // Face detection interval (adjust as needed)
        }
    };

    const stopVideo = () => {
        cancelAnimationFrame(animationFrameId);
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach((track) => {
                track.stop();
            });
            videoRef.current.srcObject = null;
            
            // Clear the canvas when stopping the stream
            const canvas = canvasRef.current;
            if (canvas) {
                const context = canvas.getContext('2d');
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    };

    const handleLogin = async (data) => {
        try {
            const resp = await httpClient.post("//localhost:5000/api/v1/face-login", data);
            console.log(resp.data);
            props.setIsLogin(true);
            props.setUserName(resp.data.user_name);
            props.setUserToken(resp.data.user_token);
            stopVideo();
            props.handleClose();
            navigate("/");
        }
        catch (error) {
            // console.log(error.data.message);
        }
    }

    useEffect(() => {
        if (isStreaming) {
            loadModel();
            startVideo();
        }
        else {
            stopVideo();
        }
    },[isStreaming]);

    const handleStartStream = (e) => {
        e.preventDefault();
        setIsStreaming(true);
    };

    const handleStopStream = (e) => {
        e.preventDefault();
        setIsStreaming(false);
    };

    //   ===================================================================

    return (
        <div className="f-login-box">
            <div className='box'>
                <span className="close-icon" onClick={props.handleClose}>x</span>
                <div className='form-box'>
                    <div className='form-box-container'>
                        <div className='title'>
                            Please Login with face
                        </div>
                        <span className="caption" onClick={()=>{changePopUp("SignUp")}}>
                            You don't have an account? Create an account 
                        </span>
                        <button className="other-btn" onClick={()=>{changePopUp("PasswordLogin")}}>
                            Login with password</button>
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
                            {/* <input className='file-picker' type='file' name='file' onChange={(e)=>{changeHandler(e)}}/>  */}
                            {!isStreaming ? (
                                <button 
                                className="login-btn"
                                // onClick={runLogin}
                                onClick = {handleStartStream}
                                disabled={!/^[A-Za-z0-9]{5,30}$/.test(values["name"])}>
                                Start
                            </button> ) : (
                                <button 
                                className="login-btn"
                                onClick={handleStopStream}>
                                Stop
                            </button>)}
                        </form>
                    </div>
                </div>
                <div className="image-box">
                    <video 
                        ref={videoRef} 
                        width= {WIDTH} 
                        height= {HEIGHT} 
                        autoPlay
                        playsInline
                        className='video-login'
                        style={{display: 'none'}}
                    />
                    <canvas 
                        ref={canvasRef} 
                        width= {WIDTH} 
                        height= {HEIGHT} 
                    />
                </div>
            </div>
        </div>
    );
}

export default FaceLogin;