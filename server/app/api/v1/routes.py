
import sys
sys.path.insert(0, '../../controllers')

import base64
import io
from PIL import Image
import numpy as np

from flask import request, jsonify
from app.api.v1 import api_v1
from app.controllers.user import User_Controller
from app.controllers.photo_controller import Photo_Controller
from app.controllers.face_processing import *
from werkzeug.utils import secure_filename

user_controller = User_Controller()
photo_controller = Photo_Controller()

PROCESSING_SUCCESSED_CODE = 200
CREATED_SUCCESSED_CODE = 201
BAD_REQUEST_CODE = 400
UNAUTHORIZED_CODE = 401
SERVER_ERROR_CODE = 500


@api_v1.route('/api/photos', methods=['GET'])
def display_photos():
    
    user_name = request.form["user_name"]
    user_token = request.form["user_token"]
    filter = request.form["filter"]
    
     # Kiểm tra người dùng có tồn tại
    user = user_controller.check_user_name_exist(user_name)
    if (user is None):
        return jsonify(message="Not found user name"), UNAUTHORIZED_CODE
    
    # Kiểm tra người dùng đã đăng nhập
    if (not user_controller.is_login(user_name, user_token)):
        return jsonify(message="User had sign out"), UNAUTHORIZED_CODE
    
    # try:
    #     # Lấy danh sách ảnh của người dùng hiện tại
    #     photos = Photo.query.filter_by(user_id=user_id).all()
    #     current_photos = [photo.url for photo in photos]

    #     # In ra danh sách ảnh của người dùng hiện tại
    #     print(f"Current images for User ID {user_id}: {current_photos}")

    #     return jsonify([{'url': photo} for photo in current_photos])
    # except Exception as e:
    #     return jsonify(message=str(e)), 500

# Upload photo endpoint
@api_v1.route('/api/photos', methods=['POST'])
def upload_photo():
    user_name = request.form["user_name"]
    user_token = request.form["user_token"]
    base64_image = request.form["image"]
    
    # Kiểm tra người dùng có tồn tại
    user = user_controller.check_user_name_exist(user_name)
    if (user is None):
        return jsonify(message="Not found user name"), UNAUTHORIZED_CODE
    
    # Kiểm tra người dùng đã đăng nhập
    if (not user_controller.is_login(user_name, user_token)):
        return jsonify(message="User had sign out"), UNAUTHORIZED_CODE

    # Kiểm tra có gửi ảnh lên
    if base64_image == '':
        return jsonify(message='No image selected'), BAD_REQUEST_CODE
    
    # Lưu ảnh tải lên vào cơ sở dữ liệu
    user_id = user.id
    upload_status = photo_controller.upload(user_id, base64_image)
    
    return jsonify(message="Upload photo successfully"), CREATED_SUCCESSED_CODE

@api_v1.route('/face-sign-up', methods=["POST"])
def face_sign_up_api():
    try:
        # Get the base64-encoded image string
        base64_image = request.form["image"]
        name = request.form["user_name"]

        image = base64_image_to_numpy(base64_image)
    
        n_faces, bboxes = detect_face(image)
        
        if n_faces==1:
            isSuccessed = user_controller.face_sign_up(
                name,
                image)
            if isSuccessed:
                response = {
                    "message": "Update successfully!!!"
                }
                return jsonify(response), PROCESSING_SUCCESSED_CODE
            else:
                response = {
                    "message": "Update Failed!!!"
                }
                return jsonify(response), BAD_REQUEST_CODE
            
        return jsonify({
                "message": "Update Failed!!!"
                }), BAD_REQUEST_CODE
        
    except Exception as e:
        response = {
            "message": f'Error processing image: {str(e)}'
        }
        return response, SERVER_ERROR_CODE


@api_v1.route('/face-login', methods=["POST"])
def face_login():
    name = request.form['user_name']
    base64_image = request.form["image"]
    if base64_image is None:
        return jsonify({
            "user_name": "",
            "user_token": ""
            }), BAD_REQUEST_CODE
        
    image = base64_image_to_numpy(base64_image)
    n_faces, bboxes = detect_face(image)
    
    if n_faces == 0:
        return jsonify({
                "message": "Not found face!!!",
                "user_name": "",
                "user_token": ""
            }), BAD_REQUEST_CODE
        
    if n_faces > 1:
        return jsonify({
            "message": "Too many face!!!",
            "user_name": "",
            "user_token": ""
        }), BAD_REQUEST_CODE
        
    isSuccessed, user_name, user_token = user_controller.face_login(
        name,
        image
    )
    if isSuccessed:
        response = {
            "message": "Login successfully!!!",
            "user_name": user_name,
            "user_token": user_token
        }
        return jsonify(response), PROCESSING_SUCCESSED_CODE

    if (user_name == ""):
        response = {
            "message": "Not found user name",
            "user_name": user_name,
            "user_token": user_token
        }
        return jsonify(response), UNAUTHORIZED_CODE
    else:
        response = {
            "message": "Not matched face!!!",
            "user_name": user_name,
            "user_token": user_token
        }
        return jsonify(response), UNAUTHORIZED_CODE


@api_v1.route('/signup', methods=["POST"])
def signUp():
    name = request.json['name']
    email = request.json['email']
    password = request.json['password']
    isSuccessed,user_name,user_token = user_controller.sign_up(name,email,password)
    if isSuccessed:
        status = PROCESSING_SUCCESSED_CODE
        message = "Creating account successfully!!!"
    else:
        status = UNAUTHORIZED_CODE
        message = "User name or email is existed!!!"
    response = {
        "message": message,
        "user_name": user_name,
        "user_token": user_token
    }
    return jsonify(response), status


@api_v1.route('/login', methods=["POST"])
def login():
    name = request.json['name']
    password = request.json['password']
    isSuccessed, user_name, user_token = user_controller.authenticate(name,password)
    if isSuccessed:
        status = PROCESSING_SUCCESSED_CODE
        message = "Login successed!!!"
    else:
        status = UNAUTHORIZED_CODE
        message = "Login failed!!!"
    response = {
        "message": message,
        "user_name": user_name,
        "user_token": user_token
    }
    return jsonify(response), status


@api_v1.route('/logout', methods=["POST"])
def logout():
    user_name = request.json['user_name']
    isSuccessed = user_controller.logout(user_name)
    if isSuccessed:
        status = PROCESSING_SUCCESSED_CODE
        message = 'Logout successfully!!!'
    else:
        status = UNAUTHORIZED_CODE
        message = "Logout failed!!!"
    response = {
        "messege": message
    }
    return jsonify(response), status


@api_v1.route('/view', methods=["GET"])
def view():
    result = user_controller.view()
    status = PROCESSING_SUCCESSED_CODE
    return result, status