from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from mongoengine import Document, StringField, connect, UUIDField
from uuid import uuid4
import hashlib
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__)
CORS(app)

# Cấu hình SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./db.sqlite'  # Thay thế bằng URI của cơ sở dữ liệu 
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Khởi tạo SQLAlchemy và Migrate
db = SQLAlchemy(app)
migrate = Migrate(app, db)

def get_uuid():
    return uuid4().hex

def create_auth_token():
    return uuid4().hex

class User(db.Model):
    __tablename__ = 'user'  # Chỉ định tên bảng nếu cần
    id = db.Column(db.String(60), primary_key=True, unique=True, default=get_uuid)
    name = db.Column(db.String(255))
    email = db.Column(db.String(255))
    password = db.Column(db.String(255))
    salt = db.Column(db.String(60), nullable=False)
    image = db.Column(db.LargeBinary, nullable=True)
    embed = db.Column(db.String(1000), nullable=True)
    auth_token = db.Column(db.String(60), nullable=True)

# Định nghĩa route để đọc dữ liệu từ cơ sở dữ liệu
@app.route("/")
def read_data():
    data = User.query.all()

    # Chuyển đổi danh sách đối tượng thành danh sách có thể chuyển đổi sang JSON
    serialized_data = [{"id": item.id, "name": item.name, "email": item.email, "password": item.password} for item in data]

    return jsonify({"success": True, "data": serialized_data})

def hashing_password(password, salt):
    hashed_password = hashlib.pbkdf2_hmac('sha256', 
                                        password.encode('utf-8'), 
                                        salt.encode('utf-8'), 
                                        1000)
    return hashed_password.hex()

def create_salt():
    return uuid4().hex

# Định nghĩa route để tạo mới dữ liệu trong cơ sở dữ liệu
@app.route("/create", methods=["POST"])
def create_data():
    user_data = request.json
    name = user_data.get('name', '')
    email = user_data.get('email', '')
    password = user_data.get('password', '')

    # Tạo mới đối tượng User từ thông tin
    salt = create_salt()
    hashed_password = hashing_password(password, salt)
    auth_token = create_auth_token()
    new_user = User(name=name, email=email, password=hashed_password, salt=salt, auth_token=auth_token)

    # Không gán giá trị cho id để cơ sở dữ liệu tự tăng
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"success": True, "message": "Dữ liệu đã được lưu thành công", "data": user_data})

# Định nghĩa route để cập nhật dữ liệu trong cơ sở dữ liệu
@app.route("/update", methods=["PUT"])
def update_data():
    user_data = request.json
    user_id = user_data['id']
    del user_data['id']
    user = User.query.get(user_id)

    if user:
        # Kiểm tra nếu có mật khẩu mới và mật khẩu mới khác với mật khẩu trong cơ sở dữ liệu
        if 'password' in user_data and user_data['password']:
            if user_data['password'] != user.password:
                salt = user.salt
                hashed_password = hashing_password(user_data['password'], salt)
                user.password = hashed_password
                user.salt = salt

        # Cập nhật các trường dữ liệu khác
        for key, value in user_data.items():
            if key != 'password':
                setattr(user, key, value)

        # Lưu lại dữ liệu
        db.session.commit()

        return jsonify({"success": True, "message": "Dữ liệu đã được cập nhật thành công", "data": user_data})
    else:
        return jsonify({"success": False, "message": "Không tìm thấy người dùng có id: {}".format(user_id)})

# Định nghĩa route để xóa dữ liệu từ cơ sở dữ liệu
@app.route("/delete/<id>", methods=["DELETE"])
def delete_data(id):
    user = User.query.get(id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"success": True, "message": "Dữ liệu đã được xóa thành công"})
    else:
        return jsonify({"success": False, "message": "Không tìm thấy người dùng có id: {}".format(id)})

if __name__ == '__main__':
    app.run(port=8080, use_reloader=False)
