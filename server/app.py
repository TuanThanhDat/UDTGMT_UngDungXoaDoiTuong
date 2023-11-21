from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_pymongo import PyMongo
from mongoengine import Document, StringField, connect

app = Flask(__name__)
CORS(app)

app.config['DEBUG'] = True
app.config['PROPAGATE_EXCEPTIONS'] = True

# Establish a connection to MongoDB
connect('UDTG', host='mongodb://127.0.0.1:27017')

class User(Document):
    name = StringField()
    email = StringField()
    password = StringField()

# Định nghĩa route để đọc dữ liệu từ database
@app.route("/")
def read_data():
    data = User.objects.all()

    # Chuyển đổi QuerySet thành danh sách các đối tượng có thể chuyển đổi sang JSON
    serialized_data = [{"id": str(item.id), "name": item.name, "email": item.email, "password": item.password} for item in data]

    return jsonify({"success": True, "data": serialized_data})

# Định nghĩa route để tạo mới dữ liệu trong database
@app.route("/create", methods=["POST"])
def create_data():
    user_data = request.json
    name = user_data.get('name', '')
    email = user_data.get('email', '')
    password = user_data.get('password', '')

    # Tạo mới đối tượng User từ thông tin
    user = User(name=name, email=email, password=password)
    user.save()

    return jsonify({"success": True, "message": "Dữ liệu đã được lưu thành công", "data": user_data})

# Định nghĩa route để cập nhật dữ liệu trong database
@app.route("/update", methods=["PUT"])
def update_data():
    user_data = request.json
    user_id = user_data['id']
    del user_data['id']
    User.objects(id=user_id).update_one(**user_data)
    return jsonify({"success": True, "message": "Dữ liệu đã được cập nhật thành công", "data": user_data})

# Định nghĩa route để xóa dữ liệu từ database
@app.route("/delete/<id>", methods=["DELETE"])
def delete_data(id):
    User.objects(id=id).delete()
    return jsonify({"success": True, "message": "Dữ liệu đã được xóa thành công"})

if __name__ == '__main__':
    app.run(port=8080, use_reloader=False)
