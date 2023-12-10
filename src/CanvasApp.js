import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';


const CanvasApp = () => {
  // Trạng thái của canvas
  const [context, setContext] = useState(null);
  // Trạng thái của ảnh
  const [image, setImage] = useState(null);
  // Góc xoay của ảnh
  const [rotationAngle, setRotationAngle] = useState(0);
  // Trạng thái hover của nút tải ảnh lên
  const [hoverUploadButton, setHoverUploadButton] = useState(false);
  // Trạng thái hover của nút đối xứng ảnh
  const [hoverFlipButton, setHoverFlipButton] = useState(false);
  // Trạng thái đang thực hiện đối xứng ảnh
  const [isFlipping, setIsFlipping] = useState(false);
  // Trạng thái khi click bị tắt để tránh thực hiện thao tác khi đang xử lý
  const [isClickDisabled, setIsClickDisabled] = useState(false);
  // Trạng thái khi ảnh đã được tải lên
  const [imageLoaded, setImageLoaded] = useState(false);
  // Kích thước của ảnh
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  // Độ phóng to thu nhỏ của ảnh
  const [zoomLevel, setZoomLevel] = useState(1);
  // Ref cho nút xoay ảnh
  const rotateButtonRef = useRef(null);
  // Ref cho canvas
  const canvasRef = useRef(null);
  // Ref cho nút tải ảnh lên
  const uploadButtonRef = useRef(null);
  //Ref cho nút đối xứng
  const isFlippingRef = useRef(null);
  // Độ sáng của ảnh
  const [brightness, setBrightness] = useState(0);
  // Trạng thái kéo thả ảnh trên canvas
  const [isDragging, setIsDragging] = useState(false);
  // Vị trí bắt đầu kéo thả
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  // Vị trí của ảnh trên canvas
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  // Trạng thái để theo dõi việc tải lên ảnh mới
  const [isNewImageUploaded, setIsNewImageUploaded] = useState(false);




// Xử lý sự kiện khi người dùng nhấn chuột xuống trên canvas
const handleMouseDown = (event) => {
  const canvas = canvasRef.current;
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Lưu vị trí bắt đầu kéo thả
  setDragStart({ x: mouseX, y: mouseY });
  // Bật trạng thái đang kéo thả
  setIsDragging(true);
  // Điều chỉnh độ sáng của ảnh
  adjustBrightness(brightness);
};

// Xử lý sự kiện khi người dùng nhấc chuột lên khỏi canvas
const handleMouseUp = () => {
  // Tắt trạng thái đang kéo thả
  setIsDragging(false);
};

// Xử lý sự kiện khi người dùng di chuyển chuột trên canvas
const handleMouseMove = (event) => {
  const canvas = canvasRef.current;
  
  // Kiểm tra xem có đang trong trạng thái kéo thả không
  if (isDragging) {
    // Lấy vị trí của chuột trên canvas
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Xóa nội dung trước đó trên canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Vẽ ảnh đã xoay và điều chỉnh độ sáng tại vị trí mới
    rotateAndDrawImage1(image, rotationAngle, zoomLevel, { x: mouseX, y: mouseY });
    adjustBrightness(brightness);
  }
};


//Thay đổi độ sáng của ảnh
// Hàm điều chỉnh độ sáng của ảnh trên canvas
const adjustBrightness = (value) => {
  // Lấy ra đối tượng canvas và context hiện tại
  const canvas = canvasRef.current;
  if (canvas && context) {
    // Lấy dữ liệu pixel của toàn bộ canvas
    const data = context.getImageData(0, 0, canvas.width, canvas.height);

    // Lặp qua từng pixel (4 giá trị mỗi pixel: red, green, blue, alpha)
    for (let i = 0; i < data.data.length; i += 4) {
      // Lặp qua 3 giá trị đầu tiên (red, green, blue) để điều chỉnh độ sáng
      for (let k = 0; k < 3; k++) {
        // Áp dụng điều chỉnh với giá trị độ sáng mới
        data.data[i + k] += value;
      }
    }

    // Cập nhật lại dữ liệu pixel trên canvas
    context.putImageData(data, 0, 0);
  }
};


// Hàm xử lý sự kiện khi giá trị độ sáng thay đổi
const handleBrightnessChange = (value) => {
  // Cập nhật state độ sáng
  setBrightness(value);
  
  // Áp dụng điều chỉnh độ sáng cho ảnh trên canvas
  adjustBrightness(value);
};

// Hàm để resize ảnh
const resizeImage = (img, canvasWidth, canvasHeight) => {
  const { width, height } = img;
  const aspectRatio = width / height;

  let newWidth = width;
  let newHeight = height;

  // Kiểm tra xem ảnh có lớn hơn kích thước canvas không
  if (width > canvasWidth || height > canvasHeight) {
    // Nếu có, thực hiện việc resize
    if (width > height) {
      newWidth = canvasWidth;
      newHeight = newWidth / aspectRatio;
    } else {
      newHeight = canvasHeight;
      newWidth = newHeight * aspectRatio;
    }
  } else {
    // Nếu ảnh không lớn hơn kích thước canvas, giữ nguyên kích thước
    if (width > height) {
      newWidth = canvasWidth;
      newHeight = newWidth / aspectRatio;
    } else {
      newHeight = canvasHeight;
      newWidth = newHeight * aspectRatio;
    }
  }

  // Tạo một đối tượng ảnh mới với kích thước đã được điều chỉnh
  const resizedImg = new Image(newWidth, newHeight);
  resizedImg.src = img.src;
  return resizedImg;
};

// Hàm để xoay và vẽ ảnh
const rotateAndDrawImage = (img, angle, zoom) => {
  const { width, height } = img;

  // Lưu lại trạng thái của context
  context.save();

  // Di chuyển tâm của context đến giữa canvas
  context.translate(canvasRef.current.width / 2, canvasRef.current.height / 2);

  // Xoay context theo góc đã cho (đổi sang radian)
  context.rotate((angle * Math.PI) / 180);

  // Thực hiện vẽ ảnh đã xoay
  context.drawImage(img, -width / 2 * zoom, -height / 2 * zoom, width * zoom, height * zoom);

  // Khôi phục trạng thái của context về trạng thái trước đó
  context.restore();

  // Điều chỉnh độ sáng của ảnh sau khi xoay
  adjustBrightness(brightness);

};

// Hàm để xoay và vẽ ảnh với tùy chọn vị trí mới
const rotateAndDrawImage1 = (img, angle, zoom, position) => {

  const { width, height } = img;
  const x = position.x - canvasRef.current.width / 2;
  const y = position.y - canvasRef.current.height / 2;

  // Thực hiện điều chỉnh độ sáng trước khi xoay ảnh
  adjustBrightness(brightness);

  // Lưu trạng thái của context
  context.save();

  // Di chuyển tâm của context đến giữa canvas
  context.translate(canvasRef.current.width / 2, canvasRef.current.height / 2);

  // Xoay context theo góc đã cho (đổi sang radian)
  context.rotate((angle * Math.PI) / 180);

  // Thực hiện xoay và vẽ ảnh
  context.drawImage(img, -width / 2 * zoom + x * (1 - zoom), -height / 2 * zoom + y * (1 - zoom), width * zoom, height * zoom);

  // Khôi phục trạng thái của context về trạng thái trước đó
  context.restore();

};

// Hàm để xoay và vẽ ảnh với tùy chọn vị trí mới mà không biến đổi độ sáng của ảnh
const rotateAndDrawImage2 = (img, angle, zoom) => {
  const { width, height } = img;

  // Lưu trạng thái của context
  context.save();

  // Di chuyển tâm của context đến giữa canvas
  context.translate(canvasRef.current.width / 2, canvasRef.current.height / 2);

  // Xoay context theo góc đã cho (đổi sang radian)
  context.rotate((angle * Math.PI) / 180);

  // Thực hiện xoay và vẽ ảnh
  context.drawImage(img, -width / 2 * zoom, -height / 2 * zoom, width * zoom, height * zoom);

  // Khôi phục trạng thái của context về trạng thái trước đó
  context.restore();
};

// Hàm để xoay ảnh theo góc mới và vẽ lại
const rotateImage = (event) => {
  event.stopPropagation();

  // Tính góc xoay mới bằng cách cộng thêm 90 độ vào góc hiện tại
  const newRotationAngle = rotationAngle + 90;

  // Cập nhật giá trị góc xoay mới
  setRotationAngle(newRotationAngle);

  // Kiểm tra xem ảnh có tồn tại hay không
  if (image) {
    // Xóa nội dung hiện tại trên canvas
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Gọi hàm xoay và vẽ ảnh với góc và độ zoom mới
    rotateAndDrawImage(image, newRotationAngle, zoomLevel);
  }
};

// Hàm để xử lý sự kiện zoom trên canvas
const handleCanvasZoom = (event) => {
  // Lấy giá trị delta từ sự kiện
  const delta = event.deltaY;

  // Lấy tham chiếu đến canvas
  const canvas = canvasRef.current;

  // Lấy thông tin về kích thước và vị trí của canvas
  const rect = canvas.getBoundingClientRect();

  // Tính toán vị trí của chuột trên canvas
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Tính toán độ zoom mới
  let newZoomLevel = zoomLevel + delta * 0.001;

  // Giới hạn độ zoom trong khoảng từ 0.1 đến 3
  newZoomLevel = Math.max(0.1, Math.min(newZoomLevel, 3));

  // Cập nhật giá trị độ zoom
  setZoomLevel(newZoomLevel);

  // Kiểm tra xem ảnh có tồn tại không
  if (image) {
    // Xóa nội dung hiện tại trên canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Gọi hàm xoay và vẽ ảnh với góc, độ zoom và vị trí chuột mới
    rotateAndDrawImage1(image, rotationAngle, newZoomLevel, { x: mouseX, y: mouseY });
  }

  // Điều chỉnh độ sáng
  adjustBrightness(brightness);

  // Ngăn chặn sự kiện mặc định của trình duyệt
  event.preventDefault();
};

// Hàm xử lý sự kiện đối xứng ảnh
const flipImage = (event) => {
  // Ngăn chặn sự kiện mặc định của trình duyệt
  event.preventDefault();
  event.stopPropagation();

  // Kiểm tra điều kiện để thực hiện đối xứng
  if (!isClickDisabled && imageLoaded) {
    // Tạm dừng click để tránh xung đột
    setIsClickDisabled(true);

    // Bắt đầu quá trình đối xứng
    setIsFlipping(true);

    // Lấy dữ liệu ảnh hiện tại từ canvas
    const imageData = context.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Tạo một bản sao của dữ liệu ảnh để lưu trữ dữ liệu ảnh đối xứng
    const flippedData = context.createImageData(imageData);

    // Lặp qua từng pixel của ảnh
    for (let y = 0; y < canvasRef.current.height; y++) {
      for (let x = 0; x < canvasRef.current.width; x++) {
        // Tính toán index của pixel nguồn và pixel đích
        const sourceIndex = (y * canvasRef.current.width + x) * 4;
        const targetIndex = (y * canvasRef.current.width + (canvasRef.current.width - x - 1)) * 4;

        // Sao chép dữ liệu màu từ pixel nguồn sang pixel đích để đảo ngược đối xứng
        flippedData.data[targetIndex] = imageData.data[sourceIndex];
        flippedData.data[targetIndex + 1] = imageData.data[sourceIndex + 1];
        flippedData.data[targetIndex + 2] = imageData.data[sourceIndex + 2];
        flippedData.data[targetIndex + 3] = imageData.data[sourceIndex + 3];
      }
    }

    // Đặt dữ liệu ảnh đối xứng trở lại canvas
    context.putImageData(flippedData, 0, 0);

    // Tính toán góc xoay mới sau khi đối xứng
    const newRotationAngle = rotationAngle + 180;
    setRotationAngle(newRotationAngle);

    // Không cần thực hiện xoay và vẽ ảnh ở đây

    // Kết thúc quá trình đối xứng
    setIsFlipping(false);

    // Kết thúc tạm dừng click
    setIsClickDisabled(false);
  }
};

// Hàm xử lý khi nút tải ảnh được nhấn
const handleButtonClick = () => {
  // Kiểm tra và thay đổi màu nền của nút tải ảnh khi không trong quá trình đối xứng ảnh
  if (!isFlipping) {
    if (uploadButtonRef.current) {
      uploadButtonRef.current.style.backgroundColor = 'green';
    }
    // Thiết lập trạng thái hover cho nút tải ảnh
    setHoverUploadButton(false);
  }
};

// Hàm xử lý khi chuột di vào nút xoay ảnh
const handleRotateButtonEnter = () => {
  // Kiểm tra và thay đổi màu nền của nút xoay khi chuột di vào
  if (rotateButtonRef.current) {
    rotateButtonRef.current.style.backgroundColor = 'blue';
  }
};

// Hàm xử lý khi chuột rời khỏi nút xoay ảnh
const handleRotateButtonLeave = () => {
  // Kiểm tra và thay đổi màu nền của nút xoay khi chuột rời khỏi
  if (rotateButtonRef.current) {
    rotateButtonRef.current.style.backgroundColor = 'green';
  }
};

// Hàm xử lý khi chuột di vào nút đối xứng ảnh
const handleFlipButtonEnter = () => {
  // Kiểm tra và thay đổi màu nền của nút đối xứng khi chuột di vào
  if (isFlippingRef.current && isFlipping) {
    isFlippingRef.current.style.backgroundColor = 'blue';
  }
  // Thiết lập trạng thái hover cho nút đối xứng
  setHoverFlipButton(true);
};

// Hàm xử lý khi chuột rời khỏi nút đối xứng ảnh
const handleFlipButtonLeave = () => {
  // Kiểm tra và thay đổi màu nền của nút đối xứng khi chuột rời khỏi
  if (isFlippingRef.current && isFlipping) {
    isFlippingRef.current.style.backgroundColor = 'green';
  }
  // Thiết lập trạng thái hover cho nút đối xứng
  setHoverFlipButton(false);
};

// Callback được gọi khi ảnh được thả vào khu vực drop
const onDrop = (acceptedFiles) => {
  // Kiểm tra xem có đang trong quá trình đối xứng ảnh hay không
  if (!isFlipping) {
    // Sử dụng FileReader để đọc dữ liệu từ tệp hình ảnh
    const reader = new FileReader();

    // Xử lý sự kiện khi đọc tệp hình ảnh thành công
    reader.onload = () => {
      // Tạo một đối tượng ảnh mới
      const img = new Image();

      // Đặt nguồn dữ liệu của ảnh là dữ liệu đọc được từ tệp
      img.src = reader.result;

      // Xử lý sự kiện khi ảnh đã được tải
      img.onload = () => {
        // Lấy kích thước của ảnh
        const { width, height } = img;

        // Đặt kích thước ảnh và góc quay về giá trị ban đầu
        setImageSize({ width, height });
        setRotationAngle(0);
        setZoomLevel(1);
        setIsNewImageUploaded(true);

        // Thay đổi kích thước ảnh sao cho vừa với canvas
        const resizedImg = resizeImage(img, canvasRef.current.width, canvasRef.current.height);

        // Đặt vị trí ảnh về giữa canvas
        setImagePosition({ x: 0, y: 0 });

        // Xóa nội dung hiện tại của canvas
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Vẽ ảnh đã thay đổi lên canvas
        rotateAndDrawImage2(resizedImg, 0, 1);

        // Đặt ảnh đã thay đổi làm ảnh hiện tại
        setImage(resizedImg);
        setImageLoaded(true);

        // Đặt giá trị độ sáng về 0 khi ảnh mới được tải lên
        setBrightness(0);
        setIsNewImageUploaded(true);
      };
    };

    // Đọc nội dung của tệp hình ảnh
    reader.readAsDataURL(acceptedFiles[0]);
  }
};

// Sử dụng hook useDropzone để xử lý thả và tải ảnh
const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop,            // Callback được gọi khi ảnh được thả vào khu vực drop
  noClick: isFlipping, // Không cho phép click khi đang trong quá trình đối xứng ảnh
}); 

useEffect(() => {
  // Lấy canvas và bối cảnh vẽ 2D của nó
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  setContext(ctx); // Thiết lập bối cảnh vẽ bằng cách sử dụng hàm cập nhật trạng thái

  // Định nghĩa hàm handleCanvasZoom
  const handleCanvasZoom = (event) => {
    const delta = event.deltaY; // Lấy giá trị delta khi cuộn chuột (dương hoặc âm)
    let newZoomLevel = zoomLevel + delta * 0.001; // Điều chỉnh mức thu phóng dựa trên giá trị delta

    // Đảm bảo mức thu phóng nằm trong khoảng cụ thể
    newZoomLevel = Math.max(0.1, Math.min(newZoomLevel, 3));

    // Cập nhật trạng thái mức thu phóng
    setZoomLevel(newZoomLevel);

    if (image) {
      // Xóa canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Xoay và vẽ ảnh với mức thu phóng đã cập nhật
      rotateAndDrawImage(image, rotationAngle, newZoomLevel);
    }

    // Điều chỉnh độ sáng của ảnh
    adjustBrightness(brightness);

    event.preventDefault(); // Ngăn chặn hành vi cuộn mặc định
  };

  // Thêm bộ lắng nghe sự kiện vào canvas cho sự kiện cuộn chuột
  canvas.addEventListener('wheel', handleCanvasZoom);

  // Dọn dẹp bằng cách loại bỏ bộ lắng nghe sự kiện khi thành phần bị xóa
  return () => {
    canvas.removeEventListener('wheel', handleCanvasZoom);
  };
}, [context, zoomLevel, rotationAngle, image]);

useEffect(() => {
  const canvas = canvasRef.current; // Lấy tham chiếu đến canvas từ trạng thái refs

  // Bắt đầu thêm các bộ lắng nghe sự kiện cho các sự kiện chuột
  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mouseup', handleMouseUp);
  canvas.addEventListener('mousemove', handleMouseMove);

  // Trả về một hàm làm sạch (cleanup) để loại bỏ các bộ lắng nghe sự kiện khi thành phần bị xóa hoặc các dependency thay đổi
  return () => {
    canvas.removeEventListener('mousedown', handleMouseDown); // Loại bỏ bộ lắng nghe sự kiện mousedown
    canvas.removeEventListener('mouseup', handleMouseUp); // Loại bỏ bộ lắng nghe sự kiện mouseup
    canvas.removeEventListener('mousemove', handleMouseMove); // Loại bỏ bộ lắng nghe sự kiện mousemove
  };
}, [isDragging, dragStart, imagePosition]);

// Sử dụng useEffect để kiểm soát trạng thái của việc bật/tắt chức năng click khi đang thực hiện hoạt động lật ảnh
useEffect(() => {
  if (!isFlipping) {
    setIsClickDisabled(false);
  }
}, [isFlipping, imageSize]); // Theo dõi biến isFlipping và imageSize, nếu có thay đổi, thực hiện lại hiệu ứng

// Sử dụng useEffect để đảm bảo việc reset trạng thái click sau khi component được render
useEffect(() => {
  setIsClickDisabled(false);
}, []); // Mảng dependency rỗng đồng nghĩa với việc useEffect chỉ chạy sau lần render đầu tiên

// Sử dụng useEffect để điều chỉnh độ sáng khi ảnh mới được tải lên
useEffect(() => {
  if (isNewImageUploaded) {
    adjustBrightness(0);
    setIsNewImageUploaded(false);
  }
}, [isNewImageUploaded]); // Theo dõi biến isNewImageUploaded, nếu có thay đổi, thực hiện lại hiệu ứng










  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}
      onWheel={handleCanvasZoom}
    >
      <div>
        <label htmlFor="brightnessSlider" className="text">
          Độ sáng:
        </label>
        <Slider
          id="brightnessSlider"
          min={-100}
          max={100}
          step={1}
          value={brightness}
          style={{ width: '200px', margin: '0 auto' }}
          onChange={handleBrightnessChange}
        />
      </div>
      <div {...getRootProps()} style={dropzoneStyle}>
        <input {...getInputProps()} />
        {isDragActive ? null : (
          <div>
            <button
              ref={uploadButtonRef}
              style={{ ...uploadButtonStyle, backgroundColor: hoverUploadButton ? 'blue' : 'green' }}
              onClick={handleButtonClick}
              onMouseDown={() => {
                if (uploadButtonRef.current) {
                  uploadButtonRef.current.style.backgroundColor = 'blue';
                }
              }}
              onMouseEnter={() => setHoverUploadButton(true)}
              onMouseLeave={() => setHoverUploadButton(false)}
            >
              Tải ảnh lên
            </button>
            <button
              style={rotateButtonStyle}
              onClick={rotateImage}
              onMouseEnter={handleRotateButtonEnter}
              onMouseLeave={handleRotateButtonLeave}
            >
              Xoay ảnh
            </button>
            <button
              style={{
                ...flipButtonStyle,
                backgroundColor: hoverFlipButton ? 'blue' : 'green',
              }}
              onClick={flipImage}
              onMouseEnter={handleFlipButtonEnter}
              onMouseLeave={handleFlipButtonLeave}
            >
              Đối xứng
            </button>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} width={1000} height={1000} style={canvasStyle} />
    </div>
  );
};


const uploadButtonStyle = {
  backgroundColor: 'green',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '10px',
  marginRight: '20px',
  fontSize: '24px',
};

const rotateButtonStyle = {
  backgroundColor: 'green',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '10px',
  marginLeft: '20px',
  fontSize: '24px',
};

const flipButtonStyle = {
  backgroundColor: 'green',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginTop: '10px',
  marginLeft: '40px',
  fontSize: '24px',
};

const dropzoneStyle = {
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  marginBottom: '20px',
  transition: 'background-color 0.3s ease',
};

const canvasStyle = {
  border: '5px solid black',
};

export default CanvasApp;
