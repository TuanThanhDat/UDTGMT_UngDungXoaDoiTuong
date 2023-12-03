import sys
sys.path.insert(0, '../models')
sys.path.insert(1, '..')
from app.controllers.face_processing import verify_face, get_embed, encode_image
from app.extension import db
from app.models.user import User

from PIL import Image
from uuid import uuid4
import hashlib
import json

import numpy as np

print("app controllers")

def hashing_password(password, salt):
    hashed_password = hashlib.pbkdf2_hmac('sha256', 
                                        password.encode('utf-8'), 
                                        salt.encode('utf-8'), 
                                        1000)
    return hashed_password.hex()

def create_salt():
    return uuid4().hex

class User_Controller:
    
    def face_sign_up(self, user_name, face_image, image):
        user = self.__get_user_by_name(user_name)
        if user is not None:
            user.image = encode_image(image)
            embed = get_embed(face_image) # (2622,)
            user.embed = json.dumps(embed.tolist())
            db.session.commit()
            return True
        return False
    
    def face_login(self, user_name, face_img):
        user = self.__get_user_by_name(user_name)
        if user is not None:
            if user.embed is not None:
                embed = np.array(json.loads(user.embed),dtype=np.float32)
                if verify_face(face_img, embed):
                    auth_token = self.__create_auth_token()
                    user.auth_token = auth_token
                    db.session.commit()
                    return True, user.name, auth_token
            return False,user.name,''
        return False,'',''
            
        
    def check_user_name_exist(self,user_name):
        return User.query.filter_by(name=user_name).first() is not None

    def check_user_email_exist(self,user_email):
        return User.query.filter_by(email=user_email).first() is not None

    def add_new_user(self, user_name, user_email, user_password):
        if (not self.check_user_name_exist(user_name) and
            not self.check_user_email_exist(user_email)):
            salt = create_salt()
            hashed_password = hashing_password(user_password, salt)
            auth_token = self.__create_auth_token()
            new_user = User(name=user_name,
                            email=user_email,
                            password=hashed_password,
                            salt=salt,
                            auth_token=auth_token)
            db.session.add(new_user)
            db.session.commit()
            return True
        return False
    
    def sign_up(self,user_name, user_email, user_password):
        isSuccessed = self.add_new_user(user_name, user_email, user_password)
        if isSuccessed:
            user = self.__get_user_by_name(user_name)
            userName = user.name
            auth_token = self.__create_auth_token()
            user.auth_token = auth_token
            db.session.commit()
            return True, userName, auth_token
        return False,'',''
    
    def __get_user_by_name(self, name):
        return User.query.filter_by(name=name).first()
    
    def __get_user_by_email(self, email):
        return User.query.filter_by(email=email).first()
    
    def __get_user_by_id(self, id):
        return User.query.filter_by(id=id).first()
    
    def authenticate(self, user_name, user_password):
        if (self.check_user_name_exist(user_name)):
            user = self.__get_user_by_name(user_name)
        elif (self.check_user_email_exist(user_name)):
            user = self.__get_user_by_email(user_name)
        else:
            return False,'',''
        hashed_password = hashing_password(user_password, user.salt)
        if (hashed_password == user.password):
            auth_token = self.__create_auth_token()
            userName = user.name
            user.auth_token = auth_token
            db.session.commit()
            return True, userName, auth_token
        else:
            return False,'',''
        
    def __create_auth_token(self):
        return uuid4().hex
    
    def logout(self, userName):
        user = self.__get_user_by_name(userName)
        if (user is not None):
            user.auth_token = None
            db.session.commit()
            return True
        return False
    
    def view(self):
        users = User.query.all()
        result = []
        for user in users:
            embed_bytes = user.embed
            print(type(embed_bytes))
            np.frombuffer(embed_bytes,dtype=np.float32).tolist()
            result.append([user.id, user.name, user.email, user.auth_token, ])
        return result