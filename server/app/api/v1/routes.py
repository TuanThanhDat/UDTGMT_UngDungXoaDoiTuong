
import sys
sys.path.insert(0, '../../controllers')
from app.controllers.user import User_Controller
from flask import request, jsonify
from app.api.v1 import api_v1

user_controller = User_Controller()


@api_v1.route('/signup', methods=["POST"])
def signUp():
    name = request.json['name']
    email = request.json['email']
    password = request.json['password']
    isSuccessed,user_id,user_token = user_controller.sign_up(name,email,password)
    if isSuccessed:
        status = 200
        message = "Creating account successfully!!!"
    else:
        status = 401
        message = "User name or email is existed!!!"
    response = {
        "message": message,
        "user_id": user_id,
        "user_token": user_token
    }
    return jsonify(response), status


@api_v1.route('/login', methods=["POST"])
def login():
    name = request.json['name']
    password = request.json['password']
    isSuccessed, user_id,user_token = user_controller.authenticate(name,password)
    if isSuccessed:
        status = 200
        message = "Login successed!!!"
    else:
        status = 401
        message = "Login failed!!!"
    response = {
        "message": message,
        "user_id": user_id,
        "user_token": user_token
    }
    return jsonify(response), status


@api_v1.route('/logout', methods=["POST"])
def logout():
    userID = request.json['userID']
    isSuccessed = user_controller.logout(userID)
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