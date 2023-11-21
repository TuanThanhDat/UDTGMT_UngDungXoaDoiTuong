import sys
sys.path.insert(0, '../models')
sys.path.insert(1, '..')
from app.extension import db
from app.models.user import User

from uuid import uuid4
import hashlib

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
            userID = user.id
            auth_token = self.__create_auth_token()
            user.auth_token = auth_token
            db.session.summit()
            return True, userID, auth_token
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
            userID = user.id
            user.auth_token = auth_token
            db.session.commit()
            return True, userID, auth_token
        else:
            return False,'',''
        
    def __create_auth_token(self):
        return uuid4().hex
    
    def logout(self, userID):
        user = self.__get_user_by_id(userID)
        if (user is not None):
            user.auth_token = None
            db.session.commit()
            return True
        return False
    
    def view(self):
        users = User.query.all()
        result = []
        for user in users:
            result.append([user.id, user.name, user.email, user.auth_token])
        return result