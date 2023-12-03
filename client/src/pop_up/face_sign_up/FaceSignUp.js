import "./FaceSignUp.css"
import React, {useState, useRef, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import httpClient from '../../httpClient';
// import FormInput from '../FormInput/FormInput';

import * as faceapi from 'face-api.js';

const FaceSignUp = (props) => {
    const [numFaces, setNumFace] = useState(null);
    const [image, setImage] = useState(null);
    const [isTakePic, setIsTakePic] = useState(false);
    // const navigate = useNavigate();

    //   ===================================================================
    const HEIGHT = 444;
    const WIDTH = 474;
    
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    let animationFrameId = null;

    const [isStreaming, setIsStreaming] = useState(false);
    // const [detectedFaces, setDetectedFaces] = useState([]);

    const handleSignUp = async (data) => {
        try {
            const resp = await httpClient.post("//localhost:5000/api/v1/face-sign-up", data);
            console.log(resp.data);
            // alert(resp.data.message);
        }
        catch (error) {
            // console.log(error.data.message);
        }
    }

    useEffect(() => {
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
                    setNumFace(detections.length);
                    const resizedDetections = faceapi.resizeResults(detections, displaySize);
                    
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    
                    // Draw video frame on canvas
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    setImage(canvas.toDataURL('image/jpeg'));
                    console.log(image)
                    // Draw bounding boxes around detected faces
                    ctx.fillStyle = 'red';
                    ctx.strokeStyle = 'green';
                    ctx.lineWidth = 3;
                    resizedDetections.forEach(detection => {
                        const { x, y, width, height } = detection.box;
                        ctx.strokeRect(x, y, width, height);
                    });
                }, 300);
            }
        };

        const stopVideo = (isClear) => {
            cancelAnimationFrame(animationFrameId);
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach((track) => {
                    track.stop();
                });
                videoRef.current.srcObject = null;
                
                if (isClear) {
                    // Clear the canvas when stopping the stream
                    const canvas = canvasRef.current;
                    if (canvas) {
                        const context = canvas.getContext('2d');
                        context.clearRect(0, 0, canvas.width, canvas.height);
                    }
                }
                props.handleClose();
            }
        };
        if (isStreaming && !isTakePic) {
            loadModel();
            startVideo();
        }
        else if (isTakePic) {
            if (numFaces===1) {
                const data = new FormData();
                data.append('user_name', props.userName);
                data.append('image', image);
                stopVideo(false);
                handleSignUp(data);
            }
        }
        else {
            stopVideo(true);
        }
    },[isStreaming, isTakePic]);

    const handleStartStream = (e) => {
        e.preventDefault();
        setIsStreaming(true);
    };

    const handleStopStream = (e) => {
        e.preventDefault();
        setIsStreaming(false);
    };

    const handleTakePic = (e) => {
        e.preventDefault();
        setIsTakePic(true);
    };

    //   ===================================================================

    return (
        <div className="f-sign-up-box">
            <div className='box'>
                <span className="close-icon" onClick={props.handleClose}>x</span>
                <div className='form-box'>
                    <div className='form-box-container'>
                        {!isStreaming ? (
                            <button 
                            className="login-btn"
                            onClick = {handleStartStream}>
                            Start
                        </button> ) : (
                            <button 
                            className="login-btn"
                            onClick={handleStopStream}>
                            Stop
                        </button>)}
                        <button 
                            onClick={handleTakePic}
                            disabled={!isStreaming}
                        >
                            Take picture
                        </button>
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

export default FaceSignUp;