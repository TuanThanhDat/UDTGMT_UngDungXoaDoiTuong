import React from 'react';
import ReactDOM from 'react-dom/client'; // Import ReactDOM để có thể render component vào DOM
import './index.css'; // Import file CSS cho styling
import Client from './Client'; // Import component chính của ứng dụng

// Tạo một root React để render component chính vào element có id là 'root'
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render component chính (App) vào DOM thông qua root React đã tạo
root.render(
  // <React.StrictMode>
    <Client />
  // </React.StrictMode>
);


