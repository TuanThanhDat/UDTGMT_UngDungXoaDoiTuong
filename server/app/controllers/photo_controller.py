
from app.models.photo import Photo
from app.controllers.face_processing import encode_image


class Photo_Controller:
    def view_with_filter(self, user_id):
        photos = Photo.query.filter_by(user_id=user_id).all()
        # response_photos = {f"{}"}
    
    def upload(self, user_id, image):
        '''
        Mục đích: Tải ảnh mới và lưu lại trên server
        Tham số:
            - image: base64_image
        '''
        # Lưu ảnh
        new_photo = Photo(user_id=user_id, image=image)
        db.session.add(new_photo)
        db.session.commit()
        # Trả về lưu thành công
        return True