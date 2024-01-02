import "./Editor.css";
import { useEffect, useRef, useState } from "react";
import { BiBox, BiImage, BiSolidEraser, BiSave } from "react-icons/bi";
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import { RiDownloadLine } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { CgEditFlipH, CgEditFlipV } from "react-icons/cg";
import { AiOutlineRotateLeft, AiOutlineRotateRight } from "react-icons/ai";
import { IoSearchSharp } from "react-icons/io5";
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";
import { PiPaintBrushBold } from "react-icons/pi";
import { RiDeleteBin6Line } from "react-icons/ri";

import httpClient from '../../httpClient';
import PopUp from '../../pop_up/PopUp';
import { useNavigate } from 'react-router-dom';

// Thư viện cho Xử lý tải ảnh lên ====================
import { useDropzone } from 'react-dropzone';

const AboveNav = (props) => {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    // POP UP =====================================
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [popupType, setPopupType] = useState('')
    const handleClick = (type) => {
        if (type === "LogOut") {
            props.setIsLogin(false);
            navigate('/');
        }
        else {
            setPopupType(type);
            togglePopup();
        }
    }
    const togglePopup = () => {
        setIsOpen(!isOpen);
    }

    const User = () => {
        useEffect(() => {
            const trigger = document.querySelector('#btn-user');
            const hiddenContent = document.querySelector('.dropdown-place');
            // Hold for show dropdown user menu
            if (trigger && hiddenContent) {
                trigger.addEventListener('mouseover', function() {
                    hiddenContent.style.display = 'block';
                });
                trigger.addEventListener('mouseout', function() {
                    hiddenContent.style.display = 'none';
                });
                hiddenContent.addEventListener('mouseover', function() {
                    hiddenContent.style.display = 'block';
                });
                hiddenContent.addEventListener('mouseout', function() {
                    hiddenContent.style.display = 'none';
                });
            }
        },[]);
    
        return (
            <div className="user-place">
                <div className="user">
                    <span id="btn-user"></span>
                </div>
                <div className="dropdown-place">
                    <ul className="dropdown">
                        <li onClick={()=>{handleClick("FaceSignUp")}}>Face registration</li>
                        <li onClick={()=>{handleClick("LogOut")}}>Sign out</li>
                    </ul>
                </div>
            </div>
        )
    };

    useEffect(()=>{
        setX(props.curPos.x);
        setY(props.curPos.y);
    },[props.curPos])


    return (
        <div className="above-nav">
            {isOpen && <PopUp 
                        type={popupType} 
                        setType={setPopupType} 
                        handleClose={togglePopup} 
                        setIsLogin={props.setIsLogin}
                        userName={props.userName}
                        userToken={props.userToken}
                        setUserName={props.setUserName}
                        setUserToken={props.setUserToken}
                        serverURL={props.serverURL}/>}
            <ul className="home">
                <li className="btn-open-image" onClick={()=>{props.setIsOpenImage(true)}}>
                    <IoMdAdd className="icon"/>
                    <span className="text">Open image</span>
                </li>
                {/* <li className="btn-save">
                    <BiSave className="icon"/>
                    <span className="text">Save</span>
                </li> */}
                <li className="btn-download" onClick={()=>{props.setIsDownload(true)}}>
                    <RiDownloadLine className="icon" id="download"/>
                    <span className="text" id="download">Download</span>
                </li>
                {/* <li>
                    <input type="text" value={x}/>
                    <input type="text" value={y}/>
                </li> */}
            </ul>
            <ul className="btn-user">
                <User/>
            </ul>
        </div>
    )
};

const ToolBar = ({
    isUploaded,
    imagePos,
    imageSize,
    zoom,
    setZoom,
    brightness,
    setBrightness,
    isFlipHorizon,
    setIsFlipHorizon,
    isFlipVertical,
    setIsFlipVertical,
    collapsed,
    setCollapsed,
    rotateLeft,
    rotateRight,
    isChooseDraw,
    setIsChooseDraw,
    isDrawRemove,
    setIsDrawRemove,
    isErasing,
    setIsErasing}) => {

    const [choiceCurrent, setChoiceCurrent] = useState(0); // 0: không có, 1: nút thứ nhất, ...
    const [barType, setBarType] = useState("");

    const extentMenuRef = useRef(null);
    const collectRef = useRef(null);
    const imageRef = useRef(null);
    const adjustRef = useRef(null);
    const eraseRef = useRef(null);

    // ============ Biến cho lựa chọn Image ============
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [w, setW] = useState(0);
    const [h, setH] = useState(0);
    const minZoom = 0;
    const maxZoom = 300;

    // ============ Biến cho lựa chọn Erase ============

    const imagePaths = [
        "./signup.png",
        "./user_profile.png",
        "./test_1.jpg",
        "./test_2.jpg"
    ];

    useEffect(()=>{
        setX(imagePos.x);
        setY(imagePos.y);
        setW(imageSize.w);
        setH(imageSize.h);
    },[imagePos, imageSize]);

    useEffect(() => {
        if (collapsed){
            extentMenuRef.current.style.display = "none";
        }
        else {
            extentMenuRef.current.style.display = "block";
        }
    },[collapsed]);

    const switchCollapse = (value) => {
        if (isUploaded) {
            setCollapsed(value);
        }
    }

    const turnOffAll = () => {
        turnOff(collectRef);
        turnOff(imageRef);
        turnOff(adjustRef);
        turnOff(eraseRef);
    }

    function turnOn(r){
        r.current.style.background = 'var(--hover-color)';
        r.current.style.color = 'var(--hover-text-color)';
    }

    function turnOff(r){
        r.current.style.background = 'var(--sidebar-color)';
        r.current.style.color = 'var(--text-color)';
    }

    const handleToolClick = (number) => {
        turnOffAll();
        switchCollapse(false);
        if (number === choiceCurrent) {
            setChoiceCurrent(0);
            switchCollapse(true);
            setBarType("");
        }
        else if (number === 1) {
            turnOn(collectRef);
            setChoiceCurrent(1);
            setBarType("collection");
        }
        else if (number === 2) {
            turnOn(imageRef);
            setChoiceCurrent(2);
            setBarType("image");
        }
        else if (number === 3) {
            turnOn(adjustRef);
            setChoiceCurrent(3);
            setBarType("adjustment");
        }
        else if (number === 4) {
            turnOn(eraseRef);
            setChoiceCurrent(4);
            setBarType("erase");
        }
    }

    function ImageList({ imagePaths }) {
        return (
            <div id="imageList">
                {imagePaths.map((imagePath, index) => (
                    <img key={index} src={imagePath} alt={`Image ${index}`} />
                ))}
            </div>
        );
    }

    return (
        <div className="tool-bar">
            <div className="menu">
                <ul className="menu-links">
                    <li className="collection" ref={collectRef} onClick={()=>{handleToolClick(1)}}>
                        <BiBox className="icon" />
                        <span className="text">Collection</span>
                    </li>
                    <li className="image" ref={imageRef} onClick={()=>{handleToolClick(2)}}>
                        <BiImage className="icon"/>
                        <span className="text">Image</span>
                    </li>
                    <li className="adjust" ref={adjustRef} onClick={()=>{handleToolClick(3)}}>
                        <TbAdjustmentsHorizontal className="icon"/>
                        <span className="text">Ajustment</span>
                    </li>
                    <li className="erase" ref={eraseRef} onClick={()=>{handleToolClick(4)}}>
                        <BiSolidEraser className="icon"/>
                        <span className="text">Erase</span>
                    </li>
                </ul>
            </div>
            <div id="extent-menu" ref={extentMenuRef}>
                {barType === "collection" && (
                    <div id="collection-place">
                        <div id="search-bar">
                            <IoSearchSharp id="search-icon"/>
                            <input/>
                        </div>
                        <div id="date-sort">
                            Date sort
                            <TiArrowSortedUp className="icon"/>
                            <TiArrowSortedDown className="icon"/>
                        </div>
                        <ImageList imagePaths={imagePaths}/>
                    </div>
                )}
                {barType === "image" && (
                <div id="image-tools-place">
                    <div className="tools-display">
                        <div>
                            Parameters
                        </div>
                        <ul>
                            <li className="parameter">
                                <label>X</label>
                                <input type="text" value={x}/>
                            </li>
                            <li className="parameter">
                                <label>W</label>
                                <input type="text" value={w}/>
                            </li>
                            <li className="parameter">
                                <label>Y</label>
                                <input type="text" value={y}/>
                            </li>
                            <li className="parameter">
                                <label>H</label>
                                <input type="text" value={h}/>
                            </li>
                        </ul>
                    </div>
                    <div className="tools-display">
                        <div>
                            Zoom
                        </div>
                        <div className="bar-container">
                            <div>
                                {zoom}%
                            </div>
                            <input 
                                className="bar"
                                type="range" 
                                min={minZoom} 
                                max={maxZoom} 
                                value={zoom} 
                                onChange={(e)=>{setZoom(e.target.value)}}/>
                        </div>
                    </div>
                </div>)}
                {barType === "adjustment" && (
                    <div id="adjusment-tools-place">
                        <div className="tools-display">
                            <div>
                                Brightness
                            </div>
                            <div className="bar-container">
                                <div>
                                    {brightness}%
                                </div>
                                <input 
                                    id="zoom-bar"
                                    type="range" 
                                    min={0} 
                                    max={100}
                                    value={brightness} 
                                    onChange={(e)=>{setBrightness(e.target.value)}}/>
                            </div>
                        </div>
                        <div className="tools-display">
                            <div>
                                Flip
                            </div>
                            <div className="icons-place">
                                <CgEditFlipH className="tools-icon" onClick={()=>{setIsFlipHorizon(!isFlipHorizon)}}/>
                                <CgEditFlipV className="tools-icon" onClick={()=>{setIsFlipVertical(!isFlipVertical)}}/>
                            </div>
                        </div>
                        <div className="tools-display">
                            <div>
                                Rotate
                            </div>
                            <div className="icons-place">
                                <AiOutlineRotateLeft 
                                    className="tools-icon"
                                    onClick={rotateLeft}/>
                                <AiOutlineRotateRight 
                                    className="tools-icon"
                                    onClick={rotateRight}/>
                            </div>
                        </div>
                        <div className="tools-display">
                            <div>
                                Cut
                            </div>
                        </div>
                    </div>
                )}
                {barType === "erase" && (
                    <div id="erase-tools-place">
                        <div className="tools-display">
                            <div>
                                Choose objects
                            </div>
                            <div className="icons-place" style={{justifyContent: "left"}}>
                                <input type="checkbox" id="checkbox"/>
                            </div>
                        </div>
                        <div className="tools-display">
                            <div>
                                Draw select {isChooseDraw && ("drawing")}
                            </div>
                            <div className="icons-place">
                                <PiPaintBrushBold 
                                    className="tools-icon" 
                                    style={{marginTop:"10px"}}
                                    id ={isChooseDraw ? "choose-drawing-click":"choose-drawing"}
                                    onClick={()=>{setIsChooseDraw(!isChooseDraw)}}/>
                                <RiDeleteBin6Line 
                                    className="tools-icon" 
                                    style={{marginTop:"10px"}}
                                    onClick={()=>{
                                        setIsDrawRemove(true);
                                        if (isChooseDraw) {
                                            setIsChooseDraw(false);
                                        }
                                    }}/>
                            </div>
                        </div>
                        <div className="tools-display">
                            <div>
                                Erase
                            </div>
                            <div id="erase-button-place">
                                <button onClick={()=>{setIsErasing(true)}}>Erase Objects</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
};

const Picture = ({
    image, 
    setImage,
    imageSize,
    setImageSize, 
    zoom, 
    setZoom, 
    isUploaded, 
    setIsUploaded,
    imagePos,
    setImagePos,
    isFlipHorizon,
    isFlipVertical,
    collapsed,
    rotate,
    brightness,
    isChooseDraw,
    setIsChooseDraw,
    maskRef,
    curPos,
    setCurPos,
    isDrawRemove,
    serverURL,
    isErasing,
    setIsErasing,
    isDefaultDisplay,
    setIsDefaultDisplay}) => {
    const canvasRef = useRef(null);
    const CANVAS_WIDTH = 1300;
    const CANVAS_HEIGHT = 650;

    // const maskRef = useRef(null);

    // const [isDefaultDisplay, setIsDefaultDisplay] = useState(false);
    const PADDING_W = 100; // 100px
    const PADDING_H = 50; // 50px

    // const [startPos, setStartPos] = useState({x: 0, y: 0});
    const [isDragging, setIsDragging] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);

    // ================ CHỨC NĂNG KÉO THẢ TẢI HÌNH LÊN =================
    const onDrop = (acceptedFiles) => {
        const reader = new FileReader();
        // Khi tệp được tải
        reader.onload = () => {
            const imgTag = new Image();
            imgTag.src = reader.result;
            // Khi ảnh được tải lên
            imgTag.onload = () => {
                // Nếu là tệp ảnh
                if (imgTag.width > 0 && imgTag.height > 0) {
                    setImageSize({w: imgTag.width, h: imgTag.height});
                    // Lưu ảnh vào biến image
                    setImage(reader.result);
                    // Tải ảnh lên thành công và chuyển sang hiển thị ảnh
                    setIsUploaded(true);
                    setIsDefaultDisplay(true);
                }
            };
        };
        // đọc dữ liệu để thực hiện lệnh trong hàm onload
        reader.readAsDataURL(acceptedFiles[0]);
    };
    // Sử dụng hook useDropzone để xử lý thả và tải ảnh lên
    const {getRootProps, getInputProps} = useDropzone({onDrop});

    // ============================================================
    function zoomImage(imgTag, zoom) {
        const {width, height} = imgTag;
        const drawImage = new Image(width*zoom/100, height*zoom/100);
        drawImage.src = imgTag.src;
        return drawImage;
    }

    function getDefaultPositionAndZoom (imgTag) {
        const image_w = imgTag.width;
        const image_h = imgTag.height;
        const canvas_w = canvasRef.current.width;
        const canvas_h = canvasRef.current.height;

        // Tính tỉ lệ giữa màn hình và ảnh có thêm vùng đệm để 
        let ratio_w = (canvas_w - PADDING_W * 2) / image_w;
        let ratio_h = (canvas_h - PADDING_H * 2) / image_h;

        let ratio = Math.min(ratio_w, ratio_h);

        setZoom(Math.floor(ratio*100));

        let pos_x = Math.floor((canvas_w-image_w*ratio)/2);
        let pos_y = Math.floor((canvas_h-image_h*ratio)/2);

        setImagePos({x: pos_x, y: pos_y});
    }

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const maskCanvas = maskRef.current;

        const imgTag = new Image();
        imgTag.onload = () => {
            if (isDefaultDisplay){
                // Tính toán vị trí mặc định
                getDefaultPositionAndZoom(imgTag);
                setIsDefaultDisplay(false);
            }
            // zoom Hình cần hiển thị
            const drawImage = zoomImage(imgTag, zoom);
            
            // Canvas phụ dùng để xử lý hiển thị ảnh lật
            const tmpCanvas = document.createElement('canvas');
            const tmpCtx = tmpCanvas.getContext("2d");
            tmpCanvas.width = canvas.width;
            tmpCanvas.height = canvas.height;
            let pos_x = imagePos.x;
            let pos_y = imagePos.y;

            if (!collapsed) {
                pos_x = pos_x - 120;
            }

            if (rotate !== 0) {
                tmpCtx.translate(pos_x+drawImage.width/2, pos_y+drawImage.height/2);
                tmpCtx.rotate(-Math.PI * rotate / 180);
                tmpCtx.translate(-(pos_x+drawImage.width/2), -(pos_y+drawImage.height/2));
            }
            if (isFlipHorizon) {
                tmpCtx.translate(drawImage.width, 0);
                tmpCtx.scale(-1, 1);
                pos_x = -pos_x;
            }
            if (isFlipVertical) {
                tmpCtx.translate(0, drawImage.height);
                tmpCtx.scale(1, -1);
                pos_y = -pos_y;
            }
            tmpCtx.drawImage(drawImage, pos_x, pos_y, drawImage.width, drawImage.height);
            
            // làm mới màn hình 
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            context.drawImage(tmpCanvas, 0,0, tmpCanvas.width, tmpCanvas.height);
            context.drawImage(maskCanvas, 0, 0, maskCanvas.width+120, maskCanvas.height+120);
            context.filter = `brightness(${brightness * 100 / 50}%)`;
            // console.log("brightness: ", brightness);
        };
        // Lấy ảnh để hiển thị
        imgTag.src = image;
    };

    useEffect(()=>{
        if (image) {
            drawCanvas();
        }
    },[isDefaultDisplay, image, zoom, imagePos, collapsed, isFlipHorizon, isFlipVertical, rotate, brightness, isDrawRemove]);

    // ================ CHỨC NĂNG KÉO THẢ DI CHUYỂN HÌNH =================
    // function handleMouseDown(e) {
    //     setIsDragging(true);
    //     const canvas = canvasRef.current;
    //     const rect = canvas.getBoundingClientRect();
    //     const mouseX = e.clientX - rect.left;
    //     const mouseY = e.clientY - rect.top;
    //     setStartPos({x: mouseX, y:mouseY});
    //     setCurPos({x:mouseX-imagePos.x, y:mouseY-imagePos.y});
    // }

    // function handleMouseMove(e) {
    //     const canvas = canvasRef.current;
    //     const rect = canvas.getBoundingClientRect();
    //     const mouseX = e.clientX - rect.left;
    //     const mouseY = e.clientY - rect.top;
    //     if (isDragging) {
    //         let dX = mouseX - startPos.x;
    //         let dY = mouseY - startPos.y;
    //         setImagePos({x: imagePos.x+dX, y:imagePos.y+dY});
    //     }
    //     setCurPos({x:mouseX-imagePos.x, y:mouseY-imagePos.y});
    // }

    // function handleMouseUp(e){
    //     const canvas = canvasRef.current;
    //     const rect = canvas.getBoundingClientRect();
    //     const mouseX = e.clientX - rect.left;
    //     const mouseY = e.clientY - rect.top;
    //     if (isDragging) {
    //         const dX = mouseX - startPos.x;
    //         const dY = mouseY - startPos.y;
    //         setImagePos({x: imagePos.x+dX, y:imagePos.y+dY});
    //         setIsDragging(false);
    //         setStartPos({x:0, y:0});
    //     }
    //     setCurPos({x:mouseX-imagePos.x, y:mouseY-imagePos.y});
    // }

    const startDrawing = (e) => {
        const maskCanvas = maskRef.current;
        const maskCtx = maskCanvas.getContext('2d');
        const canvas = canvasRef.current;

        maskCtx.lineCap = 'round';
        maskCtx.lineWidth = 20;
        maskCtx.strokeStyle = 'rgb(0, 0, 255)';
        setIsDrawing(true);
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const x = mouseX;
        const y = mouseY;
        setCurPos({x:x,y:y});
        maskCtx.beginPath();
        maskCtx.moveTo(x, y);
    };

    const drawing = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const x = mouseX;
        const y = mouseY;
        if (isDrawing) {
            const maskCanvas = maskRef.current;
            // maskCanvas.width = canvas.width;
            const maskCtx = maskCanvas.getContext('2d');
            maskCtx.lineTo(x,y);
            maskCtx.stroke();
            drawCanvas();
        }
        setCurPos({x:x,y:y});
    };

    const stopDrawing = () => {
        const maskCanvas = maskRef.current;
        const maskCtx = maskCanvas.getContext('2d');
        maskCtx.closePath();
        setIsDrawing(false);
    };

    useEffect(()=>{
        // Kéo thả di chuyển ảnh
        // if (isUploaded && !isChooseDraw) {
            // const canvas = canvasRef.current;
            // // Bắt đầu thêm các bộ lắng nghe sự kiện cho các sự kiện chuột
            // canvas.addEventListener('mousedown', handleMouseDown);
            // canvas.addEventListener('mouseup', handleMouseUp);
            // canvas.addEventListener('mousemove', handleMouseMove);
    
            // // Trả về một hàm làm sạch (cleanup) để loại bỏ các bộ lắng nghe sự kiện khi thành phần bị xóa hoặc các dependency thay đổi
            // return () => {
            //     canvas.removeEventListener('mousedown', handleMouseDown); // Loại bỏ bộ lắng nghe sự kiện mousedown
            //     canvas.removeEventListener('mouseup', handleMouseUp); // Loại bỏ bộ lắng nghe sự kiện mouseup
            //     canvas.removeEventListener('mousemove', handleMouseMove); // Loại bỏ bộ lắng nghe sự kiện mousemove
            // };
        // }
        // Tô vùng màu
        if (isChooseDraw) {
            const canvas = canvasRef.current;
            canvas.addEventListener('mousedown', startDrawing);
            canvas.addEventListener('mousemove', drawing);
            canvas.addEventListener('mouseup', stopDrawing);

            return () => {
                canvas.removeEventListener('mousedown', startDrawing);
                canvas.removeEventListener('mousemove', drawing);
                canvas.removeEventListener('mouseup', stopDrawing);
            };
        }
    },[isUploaded, isDragging, isChooseDraw, isDrawing]);


    //  ==============================================
    // TẠO ẢNH MASK 
    function getMaskImage(imageData, threshold){
        const width = imageData.width;
        const height = imageData.height;
        const maskData = new Uint8ClampedArray(width * height * 4);
        for (let i = 0; i < imageData.data.length; i += 4) {
            const average = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
            maskData[i] = average > threshold ? 255 : 0; // Gán giá trị 0 hoặc 255 thay vì 1 hoặc 0
            maskData[i + 1] = average > threshold ? 255 : 0;
            maskData[i + 2] = average > threshold ? 255 : 0;
            maskData[i + 3] = 255;
        }
        return new ImageData(maskData, width, height);
    }

    function scaleImageData(imageData) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        // const width = imageData.width;
        // const height = imageData.height;
        const newWidth = imageSize.w;
        const newHeight = imageSize.h;
        // canvas.width = newWidth;
        // canvas.height = newHeight;

        const newImageData = ctx.createImageData(newWidth, newHeight);
        newImageData.data.set(imageData);
        return newImageData;
    }

    function imageDataToDataURL(imageData) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
    
        // Đặt kích thước canvas phù hợp với imageData
        canvas.width = imageData.width;
        canvas.height = imageData.height;
    
        // Đặt dữ liệu hình ảnh cho canvas
        context.putImageData(imageData, 0, 0);
    
        // Chuyển đổi canvas thành Data URL
        const dataURL = canvas.toDataURL(); // Có thể thêm định dạng hình ảnh vào đây (ví dụ 'image/jpeg')
    
        return dataURL;
    }
    
    function downloadImageFromURL(imageURL, fileName) {
        fetch(imageURL)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => console.error('Download failed:', error));
    }

    const handleSendMask = async () => {
        const canvas = canvasRef.current;
        const maskCanvas = maskRef.current;
        const maskCtx = maskCanvas.getContext("2d");

        const imageData = maskCtx.getImageData(imagePos.x, imagePos.y, Math.floor(imageSize.w*zoom/100), Math.floor(imageSize.h*zoom/100))
        console.log("OK 1");
        const scaledImageData = scaleImageData(imageData);
        console.log("OK 2");
        const maskImageData = getMaskImage(scaledImageData, 128);
        console.log("OK 3");
        const maskImageURL = imageDataToDataURL(maskImageData);
        console.log("OK 4");

        const url = imageDataToDataURL(scaledImageData);
        downloadImageFromURL(url,"mask.png");
        // downloadImageFromURL(image,"image.png");

        const data = new FormData();
        data.append("image",image);
        data.append("mask",maskImageURL);

        try {
            const resp = await httpClient.post(`${serverURL}/api/v1/erase-object`, data);
            alert(resp.data.message);
        }
        catch (error) {
            console.log(error.data.message);
            alert(error.data.message);
        }
    };

    useEffect(()=>{
        if (isErasing) {
            handleSendMask();
            setIsErasing(false);
        }
    },[isErasing]);


    //  ==============================================

    useEffect(()=>{
        if (!collapsed) {
            const canvas = canvasRef.current;
            canvas.width = CANVAS_WIDTH - 250;
            const maskCanvas = maskRef.current;
            maskCanvas.width = CANVAS_WIDTH - 250;
        }
    },[collapsed]);

    return (
        <div className="picture">
            { !isUploaded && (
                <div id="uploading" {...getRootProps()}>
                    <input {...getInputProps()}/>
                    Drag or upload your own images
                    <button id="btn-uploading">
                        Open Image
                    </button>
                </div>
            )}
            {isUploaded && (
                <div id="picture-place">
                    <canvas 
                        ref={canvasRef} 
                        id="ref-picture"
                        width={collapsed ? CANVAS_WIDTH : CANVAS_WIDTH+100}
                        height={CANVAS_HEIGHT}
                        />
                    <canvas 
                        ref={maskRef} 
                        style={{display: "none"}} 
                        height={CANVAS_HEIGHT} 
                        width={collapsed ? CANVAS_WIDTH : CANVAS_WIDTH+100}
                        />
                </div>
            )}
        </div>
    )
};

const Editor = (props) => {
    const [collapsed, setCollapsed] = useState(true);

    // Biến cho phần ảnh xử lý ===========
    const fileInputRef = useRef(null);
    const [isOpenImage, setIsOpenImage] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [image, setImage] = useState(null);
    const [imageSize, setImageSize] = useState({w: 0, h:0});
    const [zoom, setZoom] = useState(20);
    const [imagePos, setImagePos] = useState({x: 0, y: 0});
    const [isDownload, setIsDownload] = useState(false);
    const [isDefaultDisplay, setIsDefaultDisplay] = useState(true);

    // Chức năng chỉnh sửa ảnh ===========
    const [brightness, setBrightness] = useState(50);
    const [isFlipHorizon, setIsFlipHorizon] = useState(false);
    const [isFlipVertical, setIsFlipVertical] = useState(false);
    const [rotate, setRotate] = useState(0); // mỗi lần xoay 90 độ

    // Chức năng chọn và xóa đối tượng trong ảnh ===========
    const [isChooseObject, setIsChooseObject] = useState(false);
    const [currentObject, setCurrentObject] = useState(null); // giá trị một bbox
    const [bboxes, setBboxes] = useState(null); // danh sách các bbox
    const [isChooseDraw, setIsChooseDraw] = useState(false);
    const [isDrawRemove, setIsDrawRemove] = useState(false);
    const maskRef = useRef(null);

    const [isErasing, setIsErasing] = useState(false);

    const [curPos, setCurPos] = useState({x: 0, y:0});

    function rotateLeft (){
        let angle = rotate + 90;
        if (angle >= 360) {
            angle = 360 - angle;
        }
        setRotate(angle);
    }

    function rotateRight () {
        let angle = rotate - 90;
        if (angle < 0) {
            angle = 360 + angle;
        }
        setRotate(angle);
    }

    // Cập nhật lại kích thước ảnh sau khi thực hiện xoay
    useEffect(()=>{
        setImageSize({w: imageSize.h, h: imageSize.w});
    },[rotate]);

    useEffect(()=>{
        if (maskRef && isDrawRemove){
            const maskCanvas = maskRef.current;
            const maskCtx = maskCanvas.getContext("2d");
            maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
            setIsDrawRemove(false);
        }
    },[isDrawRemove]);


    function downloadImageFromURL(imageURL, fileName) {
        fetch(imageURL)
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => console.error('Download failed:', error));
    }

    useEffect(()=>{
        if (isDownload){
            if (isUploaded) {
                downloadImageFromURL(image, "download.png");
            }
            setIsDownload(false);
        }
    },[isDownload]);

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
                    const imgTag = new Image();
                    imgTag.src = reader.result;
                    imgTag.onload = () => {
                        // Nếu là tệp ảnh
                        if (imgTag.width > 0 && imgTag.height > 0) {
                            setImageSize({w: imgTag.width, h: imgTag.height});
                            // Lưu ảnh vào biến image
                            setImage(reader.result);
                            // Tải ảnh lên thành công và chuyển sang hiển thị ảnh
                            setIsUploaded(true);
                            setIsDefaultDisplay(true);
                        }
                    };
                }
            }
            reader.readAsDataURL(selectedFile);
        }
    }

    useEffect(()=>{
        if (isOpenImage) {
            handleImageUpload();
            setIsOpenImage(false);
        }
    },[isOpenImage]);

    return (
        <div className="editor">
            <div className="nav">
                <AboveNav 
                    curPos={curPos}
                    imagePos={imagePos}
                    isLogin={props.isLogin} 
                    setIsLogin={props.setIsLogin}
                    userName={props.userName}
                    userToken={props.userToken}
                    setUserName={props.setUserName}
                    setUserToken={props.setUserToken}
                    serverURL={props.serverURL}
                    setIsDownload={setIsDownload}
                    setIsOpenImage={setIsOpenImage}
                    handleImageOpen={handleImageUpload}/>
            </div>
            <div className="edit-place">
                <ToolBar
                    isUploaded={isUploaded}
                    image={image}
                    imageSize={imageSize}
                    imagePos={imagePos}
                    zoom={zoom}
                    setZoom={setZoom}
                    brightness={brightness}
                    setBrightness={setBrightness}
                    isFlipHorizon={isFlipHorizon}
                    setIsFlipHorizon={setIsFlipHorizon}
                    isFlipVertical={isFlipVertical}
                    setIsFlipVertical={setIsFlipVertical}
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    rotateLeft={rotateLeft}
                    rotateRight={rotateRight}
                    isChooseDraw={isChooseDraw}
                    setIsChooseDraw={setIsChooseDraw}
                    isDrawRemove={isDrawRemove}
                    setIsDrawRemove={setIsDrawRemove}
                    isErasing={isErasing}
                    setIsErasing={setIsErasing}
                    isDefaultDisplay={isDefaultDisplay}
                    setIsDefaultDisplay={setIsDefaultDisplay}/>
                <Picture 
                    image={image} 
                    setImage={setImage}
                    imageSize={imageSize}
                    setImageSize={setImageSize}
                    isUploaded={isUploaded}
                    setIsUploaded={setIsUploaded}
                    zoom={zoom}
                    setZoom={setZoom}
                    imagePos={imagePos}
                    setImagePos={setImagePos}
                    isFlipHorizon={isFlipHorizon}
                    isFlipVertical={isFlipVertical}
                    collapsed={collapsed}
                    rotate={rotate}
                    brightness={brightness}
                    isChooseDraw={isChooseDraw}
                    setIsChooseDraw={setIsChooseDraw}
                    maskRef={maskRef}
                    curPos={curPos}
                    setCurPos={setCurPos}
                    isDrawRemove={isDrawRemove}
                    serverURL={props.serverURL}
                    isErasing={isErasing}
                    setIsErasing={setIsErasing}/>
            </div>
            <input
                type='file'
                accept='image/*'
                style={{display: 'none'}}
                ref={fileInputRef}
                onChange={handleFileUpload}/>
        </div>
    )
}

export default Editor;