import React, {useState, useRef, useEffect} from 'react'

const Dev = () => {
    const [image, setImage] = useState(null);

    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);
    const maskRef = useRef(null);

    const [isDrawing, setIsDrawing] = useState(false);// tô vẽ 
    const [isCheck, setIsCheck] = useState(false);    // chọn checkbox
    const [showMask, setShowMark] = useState(false);
    const [isRemove, setIsRemove] = useState(false);

    // ==============================================
    // CHỨC NĂNG TẢI ẢNH LÊN
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
    // ==============================================
    // VẼ ẢNH
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
        if (showMask) {
            applyMask();
        }
    },[image, showMask]);

    // ==============================================
    // CHỨC NĂNG VẼ
    const handleDrawStatus = () => {
        setIsCheck(!isCheck);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        if (!isCheck) return;

        const maskCanvas = maskRef.current;
        const maskCtx = maskCanvas.getContext('2d');

        maskCtx.lineCap = 'round';
        maskCtx.lineWidth = 20;
        maskCtx.globalAlpha = 1; // Độ trong suốt của màu sắc
        maskCtx.strokeStyle = 'rgba(0, 0, 255, 0.5)';

        const startDrawing = (e) => {
            setIsDrawing(true);
            const x = e.clientX - canvas.offsetLeft;
            const y = e.clientY - canvas.offsetTop;
            maskCtx.beginPath();
            maskCtx.moveTo(x, y);
        };

        const draw = (e) => {
            if (isDrawing) {
                // maskCtx.globalCompositeOperation = 'destination-out';
                maskCtx.lineCap = 'round';
                maskCtx.lineWidth = 20;
                maskCtx.globalAlpha = 1; // Độ trong suốt của màu sắc
                maskCtx.strokeStyle = 'rgba(0, 0, 255, 0.5)';

                const x = e.clientX - canvas.offsetLeft;
                const y = e.clientY - canvas.offsetTop;

                maskCtx.lineTo(x,y);
                maskCtx.stroke();

                if (showMask) {
                    applyMask();
                }
            }
        };

        const stopDrawing = () => {
            setIsDrawing(false);
            maskCtx.closePath();
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

    // ==============================================
    // CHỨC NĂNG LƯU ẢNH MASK
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

    // ==============================================
    // CHỨC NĂNG HIỂN THỊ MASK
    const applyMask = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const maskCanvas = maskRef.current;
    
        const img = new Image();
        img.src = image;
        img.onload = () => {
            canvas.width = 500;
            canvas.height = 500;
            ctx.drawImage(img, 0, 0, 500, 500);
            ctx.drawImage(maskCanvas, 0, 0, 500, 500);
        };
    };

    const handleShowMark = () => {
        setShowMark(!showMask);
    }

    // ==============================================
    // CHỨC NĂNG XÓA VÙNG VẼ
    const handleRemoveStatus = () => {
        setIsRemove(!isRemove);
    };

    useEffect(()=> {
        if (isRemove) {
            // setIsDrawing(false);
            setIsCheck(false);
            const canvas = canvasRef.current;
            if (!canvas) return;
            if (!isCheck) return;

            const maskCanvas = maskRef.current;
            const maskCtx = maskCanvas.getContext('2d');

            maskCtx.lineCap = 'round';
            maskCtx.lineWidth = 20;
            maskCtx.globalAlpha = 1; // Độ trong suốt của màu sắc
            maskCtx.strokeStyle = 'rgba(0, 0, 255, 0.5)';

            const startRemove = (e) => {
                setIsRemove(true);
                const x = e.clientX - canvas.offsetLeft;
                const y = e.clientY - canvas.offsetTop;
                maskCtx.beginPath();
                maskCtx.moveTo(x, y);
            };

            const remove = (e) => {
                if (isRemove) {
                    // maskCtx.globalCompositeOperation = 'destination-out';
                    maskCtx.lineCap = 'round';
                    maskCtx.lineWidth = 20;
                    maskCtx.globalAlpha = 1; // Độ trong suốt của màu sắc
                    maskCtx.strokeStyle = 'rgba(0, 0, 0, 1)';

                    const x = e.clientX - canvas.offsetLeft;
                    const y = e.clientY - canvas.offsetTop;

                    maskCtx.lineTo(x,y);
                    maskCtx.stroke();

                    if (showMask) {
                        applyMask();
                    }
                }
            };

            const stopRemove = () => {
                setIsRemove(false);
                maskCtx.closePath();
            };

            canvas.addEventListener('mousedown', startRemove);
            canvas.addEventListener('mousemove', remove);
            canvas.addEventListener('mouseup', stopRemove);

            return () => {
                canvas.removeEventListener('mousedown', startRemove);
                canvas.removeEventListener('mousemove', remove);
                canvas.removeEventListener('mouseup', stopRemove);
            };
        }
    },[isRemove]);
    // ==============================================

    return (
        <div>
            <button onClick={handleImageUpload} style={{margin: "10px"}}>Upload</button>
            <label>draw</label>
            <input
                checked={isCheck}
                type="checkbox"
                onChange={handleDrawStatus}
                style={{transform: 'scale(1.5)',margin: '10px'}}/>
            <button onClick={handleSaveMaskImage} style={{margin:"10px"}}>Download</button>
            <label>show</label>
            <input
                type="checkbox"
                checked={showMask}
                onChange={handleShowMark}
                style={{transform: 'scale(1.5)',margin: '10px'}}/>
            <label>remove</label>
            <input
                type="checkbox"
                checked={isRemove}
                onChange={handleRemoveStatus}
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
            <canvas
                ref={maskRef}
                style={{ display: 'none'}}
                width={500}
                height={500}></canvas>
            {isCheck && (
                <div>
                    Is choose
                </div>
            )}
        </div>
    )
};

export default Dev

