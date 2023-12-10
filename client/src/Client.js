import React from 'react';
import "./Client.css";
import { useEffect, useState } from 'react';
import axios from "axios";
import Formtable from './components/Formtable';

// Thiết lập URL cơ sở cho các yêu cầu Axios
axios.defaults.baseURL = "http://localhost:8080/";

function Client() {
  // State để quản lý việc hiển thị form thêm mới
  const [addSection, setAddSection] = useState(false);

  // State để quản lý việc hiển thị form cập nhật
  const [editSection, setEditSection] = useState(false);

  // State lưu trữ thông tin người dùng từ form thêm mới
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: ""
  });

  // State lưu trữ thông tin người dùng từ form cập nhật
  const [formDataEdit, setFormDataEdit] = useState({
    name: "",
    email: "",
    password: "",
    id: ""
  });

  // State lưu trữ danh sách người dùng từ server
  const [dataList, setDataList] = useState([]);

  // Xử lý sự kiện thay đổi input trong form thêm mới
  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value
      };
    });
  };

  // Xử lý sự kiện nộp form thêm mới
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra độ dài của name và email
    if (formData.name.length < 2 || formData.name.length > 20) {
      alert("Tên người dùng phải có độ dài từ 5 đến 10 kí tự");
      return;
    }

    // Kiểm tra trùng lặp User name
    const isDuplicateName = dataList.some(user => user.name === formData.name);
    if (isDuplicateName) {
      alert("Tên người dùng đã tồn tại trong cơ sở dữ liệu");
      return;
    }

    // Kiểm tra trùng lặp Email
    const isDuplicateEmail = dataList.some(user => user.email === formData.email);
    if (isDuplicateEmail) {
      alert("Email đã tồn tại trong cơ sở dữ liệu");
      return;
    }

    // Kiểm tra mật khẩu chỉ chứa số và có độ dài từ 5 đến 10 số
    const passwordRegex = /^\d{5,10}$/;
    if (!passwordRegex.test(formData.password)) {
      alert("Mật khẩu phải chỉ chứa số và có độ dài từ 5 đến 10 số");
      return;
    }

    // Gửi yêu cầu thêm mới người dùng đến server
    const data = await axios.post("/create", formData);
    console.log(data);
    if (data.data.success) {
      setAddSection(false);
      alert(data.data.message);
      getFetchData();
      setFormData({
        id: "",
        name: "",
        email: "",
        password: ""
      });
    }
  };

  // Lấy dữ liệu từ server khi component được render
  const getFetchData = async () => {
    const data = await axios.get("/");
    console.log(data);
    if (data.data.success) {
      setDataList(data.data.data);
    }
  };

  useEffect(() => {
    getFetchData();
  }, []);

  // Xử lý sự kiện khi người dùng chọn xóa một bản ghi
  const handleDelete = async (id) => {
    const data = await axios.delete("/delete/" + id);
    if (data.data.success) {
      getFetchData();
      alert(data.data.message);
    }
  };

  // Xử lý sự kiện nộp form cập nhật
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Kiểm tra độ dài của name và email
    if (formDataEdit.name.length < 2 || formDataEdit.name.length > 20) {
      alert("Tên người dùng phải có độ dài từ 5 đến 10 kí tự");
      return;
    }

    // Kiểm tra trùng lặp User name
    const isDuplicateName = dataList.some(user => user.name === formDataEdit.name && user.id !== formDataEdit.id);
    if (isDuplicateName) {
      alert("Tên người dùng đã tồn tại trong cơ sở dữ liệu");
      return;
    }

    // Kiểm tra trùng lặp Email
    const isDuplicateEmail = dataList.some(user => user.email === formDataEdit.email && user.id !== formDataEdit.id);
    if (isDuplicateEmail) {
      alert("Email đã tồn tại trong cơ sở dữ liệu");
      return;
    }

    // Kiểm tra xem trường mật khẩu có thay đổi không
    if (formDataEdit.password !== "" && formDataEdit.password.trim() !== "") {
      // Kiểm tra mật khẩu nhập vào có trùng với mật khẩu từ cơ sở dữ liệu không
      const userFromDatabase = dataList.find(user => user.id === formDataEdit.id);
      if (userFromDatabase && userFromDatabase.password !== formDataEdit.password) {
        // Kiểm tra mật khẩu chỉ chứa số và có độ dài từ 5 đến 10 số
        const passwordRegex = /^\d{5,10}$/;
        if (!passwordRegex.test(formDataEdit.password)) {
          alert("Mật khẩu phải chỉ chứa số và có độ dài từ 5 đến 10 số");
          return;
        }
      }
    }

    // Gửi yêu cầu cập nhật người dùng đến server
    const data = await axios.put("/update", formDataEdit);
    if (data.data.success) {
      getFetchData();
      alert(data.data.message);
      setEditSection(false);
    }
  };

  // Xử lý sự kiện thay đổi input trong form cập nhật
  const handleEditOnChange = async (e) => {
    const { value, name } = e.target;
    setFormDataEdit((prev) => {
      return {
        ...prev,
        [name]: value
      };
    });
  };

  // Xử lý sự kiện khi người dùng chọn sửa đổi một bản ghi
  const handleEdit = (el) => {
    setFormDataEdit(el);
    setEditSection(true);
  };

  return (
    <>
      {/* Tiêu đề */}
      <div class="admin-text">Quản Lý Tài Khoản Người Dùng</div>

      {/* Phần nút thêm mới */}
      <div className="container">
        <button className="btn btn-add" onClick={() => setAddSection(true)}>
          Thêm Người Dùng
        </button>

        {/* Hiển thị form thêm mới nếu đang trong trạng thái thêm mới */}
        {addSection && (
          <Formtable
            handleSubmit={handleSubmit}
            handleOnChange={handleOnChange}
            handleclose={() => setAddSection(false)}
            rest={formData}
          />
        )}

        {/* Hiển thị form cập nhật nếu đang trong trạng thái cập nhật */}
        {editSection && (
          <Formtable
            handleSubmit={handleUpdate}
            handleOnChange={handleEditOnChange}
            handleclose={() => setEditSection(false)}
            rest={formDataEdit}
          />
        )}

        {/* Bảng hiển thị danh sách người dùng */}
        <div className='tableContainer'>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên Người Dùng</th>
                <th>Email</th>
                <th>Mật Khẩu</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* Hiển thị dữ liệu từ server */}
              {dataList[0] ? (
                dataList.map((el, index) => {
                  console.log(el);
                  return (
                    <tr key={index}>
                      <td>{el.id}</td>
                      <td>{el.name}</td>
                      <td>{el.email}</td>
                      <td>{el.password}</td>
                      <td>
                        {/* Nút sửa đổi */}
                        <button
                          className='btn btn-edit'
                          onClick={() => handleEdit(el)}
                        >
                          Sửa
                        </button>

                        {/* Nút xóa */}
                        <button
                          className='btn btn-delete'
                          onClick={() => handleDelete(el.id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                // Thông báo nếu không có dữ liệu
                <p style={{ textAlign: "center" }}>Không có dữ liệu</p>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Client;
