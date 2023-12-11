import "./face_login.css"
import React, {useState, useRef, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import httpClient from '../../httpClient';
import FormInput from '../FormInput/FormInput';

import * as faceapi from 'face-api.js';

const FaceLogin = (props) => {
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

    //   ===================================================================
    const HEIGHT = 444;
    const WIDTH = 474;
    
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    let animationFrameId = null;

    const [isStreaming, setIsStreaming] = useState(false);

    const loadModel = async() => {
        // await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.loadSsdMobilenetv1Model('/models');
        console.log("Load detect model");
    };

    const detectFaces = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        let detections = null;
        let resizedDetections = null;
        let detectLoop;
        if (video && canvas) {
            const ctx = canvas.getContext('2d');
            const displaySize = { width: video.width, height: video.height };
            faceapi.matchDimensions(canvas, displaySize);
            detectLoop = setInterval(async () => {
                // detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
                // const inputSize = 512;
                // const scoreThreshold = 0.5;
                const OPTION =new faceapi.SsdMobilenetv1Options();
                detections = await faceapi.detectAllFaces(video,OPTION);
                resizedDetections = await faceapi.resizeResults(detections, displaySize);

                // Draw video frame on canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                if (detections.length > 1) {
                    // Draw bounding boxes with red color
                    ctx.fillStyle = 'red';
                    ctx.strokeStyle = 'red';
                    ctx.lineWidth = 3;
                    resizedDetections.forEach(detection => {
                        const { x, y, width, height } = detection.box;
                        ctx.strokeRect(x, y, width, height);
                    });
                }
                else if (detections.length === 1) {
                    // Draw bounding box with green color
                    ctx.fillStyle = 'red';
                    ctx.strokeStyle = 'green';
                    ctx.lineWidth = 3;
                    resizedDetections.forEach(detection => {
                        const { x, y, width, height } = detection.box;
                        ctx.strokeRect(x, y, width, height);
                    });
                    clearInterval(detectLoop);

                    // sending frame
                    sendingFrame(canvas.toDataURL('image/jpeg'));
                }
            }, 200);
        }
    };

    const handleDetect = () => {
        const timeout = new Promise((resolve, reject) => {
            setTimeout(() => {
                reject("Not found user face!!!");
            }, 6000);
        });
        Promise.race([detectFaces(), timeout])
        .catch ((error) => {
            alert(error);
            setIsStreaming(false);
        });
    };

    const startVideo = async () => {
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                if (videoRef.current) {
                    console.log("Start video");
                    videoRef.current.srcObject = stream;
                    // detectFaces();
                    handleDetect();
                }
            })
            .catch((err) => {
                console.error('Error accessing the camera:', err);
            });
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
            console.log(error.response);
            alert(error.response.data.message);
            setIsStreaming(false);
        }
    }

    const sendingFrame = (image) => {
        console.log("Sending request");
        const data = new FormData();
        data.append("image", image);
        data.append("user_name", values["name"]);
        handleLogin(data);
    };

    const stopVideo = () => {
        cancelAnimationFrame(animationFrameId);
        if (videoRef.current && videoRef.current.srcObject) {
            console.log("Stop video");
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

    const handleClose = (e) => {
        e.preventDefault();
        if (isStreaming) {
            stopVideo();
        }
        props.handleClose();
    }

    useEffect(() => {
        if (isStreaming) {
            loadModel()
            .then(()=>{
                startVideo();
            })
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
                <span className="close-icon" onClick={handleClose}>x</span>
                <div className='form-box'>
                    <div className='form-box-container'>
                        <div className='title'>
                            Please Login with face
                        </div>
                        <span 
                            className="caption" 
                            disabled={isStreaming}
                            onClick={()=>{changePopUp("SignUp")}}>
                            You don't have an account? Create an account 
                        </span>
                        <button 
                            className="other-btn" 
                            disabled={isStreaming}
                            onClick={()=>{changePopUp("PasswordLogin")}}>
                            Login with password
                        </button>
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
                            {!isStreaming ? (
                                <button 
                                className="login-btn"
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