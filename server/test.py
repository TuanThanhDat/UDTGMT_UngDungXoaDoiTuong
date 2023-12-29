

# from face_detection import RetinaFace
# import cv2

# detector = RetinaFace()

# image = cv2.imread("test.jpg")
# image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
# image = cv2.resize(image, (450,450))

# result = detector(image)
# bboxes = []
# for face in result:
#     bboxes.append(list(face[0]))
    
# thickness = 2
# color = (0, 255, 0)
# for (x1,y1,x2,y2) in bboxes:
#     w = x2-x1
#     h = y2-y1
#     if w < 50 or h < 60:
#         continue
#     image = cv2.rectangle(image, (int(x1), int(y1)), (int(x2), int(y2)), color, thickness)

# image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

# cv2.imshow("show",image)
# cv2.waitKey(0)
# cv2.destroyAllWindows()