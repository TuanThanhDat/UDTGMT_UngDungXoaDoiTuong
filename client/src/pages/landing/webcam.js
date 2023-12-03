import React, { useRef, useEffect } from 'react';

const WebcamToCanvas = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const openVideo = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Lấy video stream từ webcam
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function(stream) {
        console.log(stream);
        video.srcObject = stream;
      })
      .catch(function(err) {
        console.error('Không thể truy cập webcam: ', err);
      });

    // Sử dụng useEffect với dependency là video để vẽ hình từ video lên canvas
    const drawToCanvas = () => {
      if (video.paused || video.ended) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      requestAnimationFrame(drawToCanvas);
    };

    video.addEventListener('play', drawToCanvas);

    return () => {
      video.removeEventListener('play', drawToCanvas);
    };
  }

  const test = () => {
    const media = navigator.mediaDevices;
    console.log(media);
  }

  useEffect(() => {
    // openVideo();
    test();
  }, []); // Dependency rỗng để chỉ chạy một lần khi component được tạo

  const stopVideo = () => {
  }

  const handleVideo = () => {
  }

  return (
    <div>
      <video ref={videoRef} width="640" height="480" autoPlay></video>
      <canvas 
        ref={canvasRef} 
        width="640" 
        height="480" 
        style={{ display: false ? 'block' : 'none' }}></canvas>
      <button onClick={handleVideo}>Video</button>
    </div>
  );
};

export default WebcamToCanvas;
