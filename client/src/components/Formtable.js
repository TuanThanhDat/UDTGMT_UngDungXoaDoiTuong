import React from 'react'
import "../Client.css"
import { MdClose } from 'react-icons/md'

// Component Formtable nhận các props từ parent component
const Formtable = ({ handleSubmit, handleOnChange, handleclose, rest }) => {
  return (
    <div className="addContainer">
      {/* Form để thêm hoặc cập nhật dữ liệu */}
      <form onSubmit={handleSubmit}>
        {/* Nút đóng form */}
        <div className="close-btn" onClick={handleclose}><MdClose/></div>

        {/* Input và label cho Tên Người Dùng */}
        <label htmlFor="name">Tên Người Dùng : </label>
        <input type="text" id="name" name="name" onChange={handleOnChange} value={rest.name}/>

        {/* Input và label cho Email */}
        <label htmlFor="email">Email : </label>
        <input type="email" id="email" name="email" onChange={handleOnChange} value={rest.email}/>

        {/* Input và label cho Mật Khẩu */}
        <label htmlFor="password">Mật Khẩu : </label>
        <input type="text" id="password" name="password" onChange={handleOnChange} value={rest.password}/>

        {/* Nút hoàn thành để thêm hoặc cập nhật dữ liệu */}
        <button className="btn">Hoàn Thành</button>
      </form>
    </div>
  )
}

export default Formtable
