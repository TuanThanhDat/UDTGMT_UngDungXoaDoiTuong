
import cv2
import numpy as np
from deepface import DeepFace
import base64
from PIL import Image
import io

verify_threshold = 0.5

def encode_image(image):
    # Convert the NumPy array back to a PIL Image
    pil_image = Image.fromarray(np.uint8(image))

    # Convert PIL Image to bytes using BytesIO
    bytes_io = io.BytesIO()
    pil_image.save(bytes_io, format='JPEG')  # You can choose the format you need
    image_bytes = bytes_io.getvalue()

    # Encode the bytes as base64
    base64_image = base64.b64encode(image_bytes)
    return base64_image


def base64_image_to_numpy(base64_image):
    # Decode into bytes
    bytes_image = base64.b64decode(base64_image.split(',')[1])
    
    # Convert bytes into a PIL Image object
    pil_image = Image.open(io.BytesIO(bytes_image))
    
    # convert PIL Image object into numpy array
    image = np.array(pil_image)
    return image

def bbox_to_face(image, bbox):
    x0 = bbox[0]
    y0 = bbox[1]
    x1 = x0 + bbox[2]
    y1 = y0 + bbox[3]
    return image[y0:y1, x0:x1]

def get_embed(img):
    embed = DeepFace.represent(img, model_name='VGG-Face')
    return np.array(embed[0]["embedding"], dtype=np.float32)


def findCosineDistance(source_representation, test_representation):
    a = np.matmul(np.transpose(source_representation), test_representation)
    b = np.sum(np.multiply(source_representation, source_representation))
    c = np.sum(np.multiply(test_representation, test_representation))
    return 1 - (a / (np.sqrt(b) * np.sqrt(c)))


def verify_face(img1, emb2):
    # 224x224
    emb1 = get_embed(img1)
    distance = findCosineDistance(emb1, emb2)
    print(distance)
    if distance <= verify_threshold:
        return True
    else:
        return False

def jsonify_bboxes(bboxes):
    new_bboxes = [
        {   
            "x": int(x),
            "y": int(y),
            "w": int(w),
            "h": int(h)
        } for (x,y,w,h) in bboxes]
    return new_bboxes


def image_file_to_numpy_array(image_file):
    return cv2.imdecode(np.fromstring(image_file.read(), np.uint8), cv2.IMREAD_COLOR)

# from face_detection import RetinaFace
def detect_face(image):
    '''
    Parameters:
        + image: [numpy array] ảnh RGB đầu vào
    Returns
        + n_faces: [int] số lượng khuôn mặt 
        + bboxs: [list] danh sách các khung bao khuôn mặt cho từng 
                khuôn mặt sắp xếp theo chiều giảm dần kích thước.
    '''
    gray_image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray_image, 
                                          scaleFactor=1.2, 
                                          minNeighbors=5,
                                          minSize=(30, 30))
    detector = dlib.get_frontal_face_detector()
    faces = detector(gray_image)
    for face in faces:
        x, y, w, h = face
        bboxes.append([x,y,w,h])
    
    # min_w = 50
    # min_h = 60
    # score_threshold = 0.6
    
    # detector = RetinaFace()
    # copy_image = image
    # result = detector(copy_image)
    # bboxes = []
    # for face in result:
    #     x1, y1, x2, y2 = list(face[0])
    #     score = face[2]
    #     print(face[2])
    #     x1 = int(x1)
    #     y1 = int(y1)
    #     x2 = int(x2)
    #     y2 = int(y2)
    #     w = x2-x1
    #     h = y2-y1
    #     if w < min_w or h < min_h:
    #         continue
    #     if score < score_threshold:
    #         continue
    #     bboxes.append([x1,y1,w,h])
    return len(bboxes), bboxes