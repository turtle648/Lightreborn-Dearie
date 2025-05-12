# yolo_server.py

from flask import Flask, request, jsonify
from ultralytics import YOLO
import numpy as np
import cv2

app = Flask(__name__)
model = YOLO("yolov8n.pt")  # YOLO 모델 불러오기

@app.route("/api/app/missions/{missionId}/completions", methods=["POST"])
def detect():
    if "image" not in request.files:
        return jsonify({"error": "이미지를 업로드하세요"}), 400

    file = request.files["image"]
    img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
    results = model(img)

    output = []
    for box in results[0].boxes:
        output.append({
            "class": int(box.cls[0]),
            "confidence": float(box.conf[0]),
            "box": [float(x) for x in box.xyxy[0]]
        })

    return jsonify(output)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
