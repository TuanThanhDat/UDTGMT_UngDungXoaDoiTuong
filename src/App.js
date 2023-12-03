import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [containerSize, setContainerSize] = useState({ width: 600, height: 600 });
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        // Thay đổi kích thước ảnh để fit vào khung
        const widthRatio = containerSize.width / img.width;
        const heightRatio = containerSize.height / img.height;
        const scale = Math.max(widthRatio, heightRatio); // Sử dụng Math.max thay vì Math.min
        const newWidth = img.width * scale;
        const newHeight = img.height * scale;
  
        setImageSize({ width: newWidth, height: newHeight });
      };
    };
    reader.readAsDataURL(file);
  };


  useEffect(() => {
    const updateContainerSize = () => {
      const container = document.getElementById('imageContainer');
      if (container) {
        // Sử dụng hàm setContainerSize để cập nhật giá trị mới của containerSize
        setContainerSize({
          width: container.offsetWidth,
          height: container.offsetHeight,
        });
      }
    };

    window.addEventListener('resize', updateContainerSize);
    updateContainerSize();

    return () => {
      window.removeEventListener('resize', updateContainerSize);
    };
  }, []); // Phải truyền mảng rỗng để useEffect chỉ chạy một lần sau khi render

//...

return (
  <div className="App" style={{ textAlign: 'center', paddingTop: '50px' }}>
    <div style={{ position: 'relative' }}>
      <input
        type="file"
        id="fileInput"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: 'pointer',
        }}
      />
      <label
        htmlFor="fileInput"
        className="fileInputLabel"
        style={{
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '20px',
          display: 'inline-block',
          cursor: 'pointer',
          border: '2px solid #333',
          padding: '10px',
          borderRadius: '5px',
          color: 'white',
          background: 'blue',
          transition: 'background 0.3s',
        }}
        onMouseOver={() => {
          fileInputRef.current.style.background = 'red';
        }}
        onMouseOut={() => {
          fileInputRef.current.style.background = 'blue';
        }}
      >
        Chọn File
      </label>
    </div>
    <div
      id="imageContainer"
      style={{
        border: '3px dashed #333',
        borderRadius: '5px',
        padding: '20px',
        width: containerSize.width, // Kích thước của container
        height: containerSize.height, // Kích thước của container
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center', // Căn giữa theo chiều dọc
        justifyContent: 'center', // Căn giữa theo chiều ngang
        margin: 'auto', // Thử thêm margin: auto
      }}
    >

      {selectedFile && (
        <img
          src={URL.createObjectURL(selectedFile)}
          alt="Selected File"
          style={{
            width: imageSize.width <= containerSize.width ? 'auto' : '100%',
            height: imageSize.height <= containerSize.height ? 'auto' : '100%',
            display: 'block',
          }}
        />
      )}
    </div>
  </div>
);

}

export default App;
