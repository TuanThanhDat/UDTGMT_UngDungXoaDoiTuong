import React from 'react';
import "./Client.css";
import { useEffect, useState } from 'react';
import axios from "axios";
import Formtable from './components/Formtable';

// Thiết lập URL cơ sở cho các yêu cầu Axios
axios.defaults.baseURL = "http://localhost:8080/";

function Client() {
  const [addSection, setAddSection] = useState(false);
  const [editSection, setEditSection] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: ""
  });
  const [formDataEdit, setFormDataEdit] = useState({
    name: "",
    email: "",
    password: "",
    id: ""
  });
  const [dataList, setDataList] = useState([]);

  // Xử lý sự kiện thay đổi input trong form
  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value
      };
    });
  };



  // Xử lý sự kiện khi người dùng nộp form để thêm mới
  const handleSubmit = async (e) => {
    e.preventDefault();
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

  // Xử lý sự kiện khi người dùng nộp form để cập nhật
  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = await axios.put("/update", formDataEdit);
    if (data.data.success) {
      getFetchData();
      alert(data.data.message);
      setEditSection(false);
    }
  };

  // Xử lý sự kiện thay đổi input trong form sửa đổi
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
      <div class="admin-text">Quản Lý Tài Khoản Người Dùng</div>

      <div className="container">
        <button className="btn btn-add" onClick={() => setAddSection(true)}>
          Thêm Người Dùng
        </button>

        {addSection && (
          <Formtable
            handleSubmit={handleSubmit}
            handleOnChange={handleOnChange}
            handleclose={() => setAddSection(false)}
            rest={formData}
          />
        )}
        {editSection && (
          <Formtable
            handleSubmit={handleUpdate}
            handleOnChange={handleEditOnChange}
            handleclose={() => setEditSection(false)}
            rest={formDataEdit}
          />
        )}

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
                        <button
                          className='btn btn-edit'
                          onClick={() => handleEdit(el)}
                        >
                          Sửa
                        </button>
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
