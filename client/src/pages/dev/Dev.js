import React, {useState, useRef, useEffect} from 'react'

const Dev = () => {
    const [image, setImage] = useState(null);

    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);

    const [isDrawing, setIsDrawing] = useState(false);// tô vẽ 
    const [isCheck, setIsCheck] = useState(false);    // chọn checkbox

    const handleImageUpload = () => {
        fileInputRef.current.click();
    }

    const handleFileUpload = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload= () => {
                if (reader.readyState===2){
                    setImage(reader.result);
                }
            }
            reader.readAsDataURL(selectedFile);
        }
    }

    useEffect(()=>{
        if (image) {
            const canvas = canvasRef.current;
            const cxt = canvas.getContext("2d");
            const img = new Image();
            img.src = image;
            img.onload = () => {
                canvas.width = 500;
                canvas.height = 500;
                cxt.drawImage(img, 0, 0, 500, 500);
            };
        }
    },[image]);

    const handleDrawStatus = () => {
        setIsCheck(!isCheck);
    };

    // Vẽ vùng đối tượng
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        if (!isCheck) return;

        const ctx = canvas.getContext('2d');
        ctx.globalCompositeOperation = 'destination-out';
        // Thay đổi ngòi tô
        // Tạo mask bằng cách vẽ một hình tròn có màu đỏ và độ trong suốt
        ctx.lineWidth = 30;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'rgba(0, 0, 200, 0.01)';

        const startDrawing = (e) => {
            setIsDrawing(true);
            ctx.beginPath();
            ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        };

        const draw = (e) => {
            if (isDrawing) {
                ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
                ctx.stroke();
            }
        };

        const stopDrawing = () => {
            setIsDrawing(false);
            ctx.closePath();
        };

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);

        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing);
        };
    }, [isCheck, isDrawing]);

    const handleSaveImage = () => {
        const canvas = canvasRef.current;
        if (image) {
            const img = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'drawing.png';
            link.href = img;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleSaveMaskImage = () => {
        const canvas = canvasRef.current;
        const maskCanvas = document.createElement('canvas');
        const maskCtx = maskCanvas.getContext('2d');

        maskCanvas.width = canvas.width;
        maskCanvas.height = canvas.height;

        maskCtx.fillStyle = 'black';
        maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
        maskCtx.globalCompositeOperation = 'destination-out';
        maskCtx.drawImage(canvas, 0, 0);

        const link = document.createElement('a');
        maskCanvas.toBlob((blob) => {
        link.href = URL.createObjectURL(blob);
        link.download = 'mask_image.png';
        link.click();
        }, 'image/png');
    };

    return (
        <div>
            <button onClick={handleImageUpload} style={{margin: "10px"}}>Upload</button>
            <button onClick={handleSaveMaskImage}>Download</button>
            <input
                type="checkbox"
                onChange={handleDrawStatus}
                style={{transform: 'scale(1.5)',margin: '10px'}}/>
            <br></br>
            <input
                type='file'
                accept='image/*'
                style={{display: 'none'}}
                ref={fileInputRef}
                onChange={handleFileUpload}/>
            {image && (
            <canvas 
                ref={canvasRef}
                style={{ border: '1px solid black' }}></canvas>)}
            {isCheck && (
                <div>
                    Is choose
                </div>
            )}
        </div>
    )
};

export default Dev

