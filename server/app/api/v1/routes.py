
import sys
sys.path.insert(0, '../../controllers')

import base64
import io
from PIL import Image
import numpy as np

from flask import request, jsonify
from app.api.v1 import api_v1
from app.controllers.user import User_Controller
from app.controllers.face_processing import *

user_controller = User_Controller()


@api_v1.route('/face-sign-up', methods=["POST"])
def face_sign_up_api():
    try:
        # Get the base64-encoded image string
        base64_image = request.form["image"]
        name = request.form["user_name"]
        print("OK")

        image = base64_image_to_numpy(base64_image)
        print("OK")
    
        n_faces, bboxes = detect_face(image)
        print("OK")
        print("nfaces: ",n_faces)
        if n_faces==1:
            isSuccessed = user_controller.face_sign_up(name,bbox_to_face(image,bboxes[0]),image)
            if isSuccessed:
                response = {
                    "message": "Update successfully!!!"
                }
                return jsonify(response), 200
            else:
                response = {
                    "message": "Update Failed!!!"
                }
                return jsonify(response), 401
            
        return jsonify({
                "message": "Update Failed!!!"
                }), 401
        
    except Exception as e:
        response = {
            "message": f'Error processing image: {str(e)}'
        }
        print(response["message"])
        return response, 500


@api_v1.route('/face-login', methods=["POST"])
def face_login_api():
    # if 'image' not in request.files:
    #     return 'No image uploaded', 400
    base64_image = request.form["image"]
    name = request.form['user_name']
    image = base64_image_to_numpy(base64_image)
    
    n_faces, bboxes = detect_face(image)
    print(n_faces)
    if n_faces==1:
        isSuccessed, user_name,user_token = user_controller.face_login(name,bbox_to_face(image,bboxes[0]))
        print(isSuccessed)
        if isSuccessed:
            response = {
                "user_name": user_name,
                "user_token": user_token
            }
            return jsonify(response), 200
        else:
            response = {
                "user_name": user_name,
                "user_token": user_token
            }
            return jsonify(response), 401
    return jsonify({
            "user_name": "",
            "user_token": ""
            }), 401


@api_v1.route('/face-detection', methods=["POST"])
def face_detection():
    # if 'image' not in request.files:
    #     return 'No image uploaded', 400
    try :
        # Get the base64-encoded image string
        base64_image = request.form["image"]
        
        # Decode into bytes
        bytes_image = base64.b64decode(base64_image.split(',')[1])
        
        # Convert bytes into a PIL Image object
        pil_image = Image.open(io.BytesIO(bytes_image))
        # image = Image.open(bytes_image)
        
        if pil_image.format not in ('JPEG', 'PNG', 'BMP'):
            return jsonify({'message': 'Invalid image format'}),400
        
        # convert PIL Image object into numpy array
        image = np.array(pil_image)
        
        # Detect faces
        n_faces, bboxes = detect_face(image)
        if (n_faces > 0):
            bboxes = jsonify_bboxes(bboxes)
        response = {
            "message": "Detect face successfully!!!",
            "n_faces": n_faces,
            "bboxes": bboxes
        }
        return jsonify(response),200
    
    except Exception as e:
        response = {
            "message": f'Error processing image: {str(e)}'
        }
        print(response["message"])
        return response, 500
    
   


@api_v1.route('/signup', methods=["POST"])
def signUp():
    name = request.json['name']
    email = request.json['email']
    password = request.json['password']
    isSuccessed,user_name,user_token = user_controller.sign_up(name,email,password)
    if isSuccessed:
        status = 200
        message = "Creating account successfully!!!"
    else:
        status = 401
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
        status = 200
        message = "Login successed!!!"
    else:
        status = 401
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
        status = 200
        message = 'Logout successfully!!!'
    else:
        status = 401
        message = "Logout failed!!!"
    response = {
        "messege": message
    }
    return jsonify(response), status


@api_v1.route('/view', methods=["GET"])
def view():
    result = user_controller.view()
    status = 200
    return result, status