package com.ssafy.backend.common.client;

import com.ssafy.backend.common.client.dto.YoloDetectionResult;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.opencv.core.*;
import org.opencv.dnn.Dnn;
import org.opencv.dnn.Net;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;
import org.springframework.stereotype.Component;

import java.io.*;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
public class OpenCvYoloService {

    private Net net;
    private List<String> classes;
    private float confThreshold = 0.25f;
    private float nmsThreshold = 0.45f;

    @PostConstruct
    public void init() throws IOException {
        // OpenCV 라이브러리 로드
        nu.pattern.OpenCV.loadLocally();

        // 클래스 이름 로드 (리소스에서)
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream("models/synset.txt")) {
            if (inputStream == null) {
                throw new IOException("synset.txt 파일을 찾을 수 없습니다. 경로: models/synset.txt");
            }

            classes = new BufferedReader(new InputStreamReader(inputStream))
                    .lines()
                    .collect(Collectors.toList());
        }

        // ONNX 모델 로드
        try (InputStream modelInputStream = getClass().getClassLoader().getResourceAsStream("models/best.onnx")) {
            if (modelInputStream == null) {
                throw new IOException("모델 파일을 찾을 수 없습니다. 경로: models/best.onnx");
            }

            // 임시 파일로 모델 저장
            File tempFile = File.createTempFile("yolo_model", ".onnx");
            tempFile.deleteOnExit(); // 애플리케이션 종료 시 임시 파일 삭제

            try (FileOutputStream out = new FileOutputStream(tempFile)) {
                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = modelInputStream.read(buffer)) != -1) {
                    out.write(buffer, 0, bytesRead);
                }
            }

            // 임시 파일에서 모델 로드
            net = Dnn.readNetFromONNX(tempFile.getAbsolutePath());
        }

        System.out.println("OpenCV YOLO 모델 로드 완료");
        System.out.println("클래스 목록: " + classes);
    }

    /**
     * S3 URL에서 이미지를 로드하고 객체 감지 수행
     */
    public List<YoloDetectionResult> detectFromUrl(String imageUrl) throws IOException {
        // URL에서 이미지 다운로드
        byte[] imageData = downloadImage(imageUrl);

        // 이미지 데이터를 OpenCV Mat으로 변환
        Mat img = Imgcodecs.imdecode(new MatOfByte(imageData), Imgcodecs.IMREAD_COLOR);
        if (img.empty()) {
            throw new IOException("이미지를 로드할 수 없습니다: " + imageUrl);
        }

        System.out.println("원본 이미지 크기: " + img.width() + "x" + img.height());

        // 객체 감지 수행
        return detectObjects(img);
    }

    /**
     * URL에서 이미지 다운로드
     */
    private byte[] downloadImage(String imageUrl) throws IOException {
        try (InputStream in = new URL(imageUrl).openStream();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = in.read(buffer)) != -1) {
                out.write(buffer, 0, bytesRead);
            }

            return out.toByteArray();
        }
    }

    /**
     * OpenCV를 사용하여 객체 감지 수행
     */
    private List<YoloDetectionResult> detectObjects(Mat img) {
        // 이미지 전처리
        Mat blob = preprocessImage(img);

        // 모델에 입력
        net.setInput(blob);

        // 추론 실행 (YOLO 출력 가져오기)
        List<String> outLayerNames = net.getUnconnectedOutLayersNames();
        List<Mat> outputs = new ArrayList<>();
        net.forward(outputs, outLayerNames);

        // 결과 처리
        return postprocessDetectionsV8(outputs, img);
    }

    /**
     * 이미지 전처리 (리사이징, 정규화)
     */
    private Mat preprocessImage(Mat img) {
        // 이미지 리사이징 (640x640)
        Mat resized = new Mat();
        Imgproc.resize(img, resized, new Size(640, 640));

        // YOLO 입력 블롭 생성 (RGB 채널, 픽셀 값 정규화)
        Mat blob = Dnn.blobFromImage(
                resized,              // 입력 이미지
                1.0/255.0,           // 스케일링 팩터 (0-255 → 0-1)
                new Size(640, 640),  // 출력 크기
                new Scalar(0, 0, 0), // 평균 빼기 (0이면 무시)
                true,                // RGB → BGR 변환 (OpenCV는 BGR 사용)
                false                // 채널별 처리 없음
        );

        return blob;
    }

    /**
     * YOLOv8 출력 결과 후처리 및 YoloDetectionResult 변환
     */
    private List<YoloDetectionResult> postprocessDetectionsV8(List<Mat> outputs, Mat img) {
        List<YoloDetectionResult> results = new ArrayList<>();
        float imgWidth = (float) img.width();
        float imgHeight = (float) img.height();

        try {
            // 디버깅: 출력 정보 출력
            System.out.println("출력 레이어 수: " + outputs.size());
            for (int i = 0; i < outputs.size(); i++) {
                System.out.println("출력 " + i + " 형태: " + outputs.get(i).size());
            }

            // YOLOv8 출력 처리
            Mat output = outputs.get(0);
            System.out.println("출력 차원 수: " + output.dims());
            for (int i = 0; i < output.dims(); i++) {
                System.out.println("차원 " + i + " 크기: " + output.size(i));
            }

            // YOLOv8 ONNX 출력 형식: [1, 8, 8400]
            // 여기서 8은 x, y, w, h + 4개 클래스에 대한 신뢰도
            // 8400은 앵커 수
            int rows = (int) output.size(0); // batch size
            int cols = (int) output.size(1); // 좌표(4) + 클래스 수(4)
            int numAnchors = (int) output.size(2); // 앵커 수

            System.out.println("YOLOv8 출력 형식: " + rows + " x " + cols + " x " + numAnchors);
            int numClasses = cols - 4; // 클래스 수 (좌표 4개 제외)

            // 감지 결과 저장을 위한 리스트
            List<Float> confidences = new ArrayList<>();
            List<Integer> classIds = new ArrayList<>();
            List<Rect2d> boxes = new ArrayList<>();

            // 각 앵커(detection)에 대해 처리
            for (int i = 0; i < numAnchors; i++) {
                // 클래스별 신뢰도 확인
                float maxConf = 0;
                int bestClassIdx = -1;

                // 4~끝까지는 클래스별 신뢰도
                for (int c = 0; c < numClasses; c++) {
                    float conf = (float) output.get(new int[]{0, c + 4, i})[0];
                    if (conf > maxConf) {
                        maxConf = conf;
                        bestClassIdx = c;
                    }
                }

                // 신뢰도 임계값 확인
                if (maxConf > confThreshold) {
                    // 바운딩 박스 좌표 (x, y, w, h 순서)
                    float x = (float) output.get(new int[]{0, 0, i})[0];
                    float y = (float) output.get(new int[]{0, 1, i})[0];
                    float w = (float) output.get(new int[]{0, 2, i})[0];
                    float h = (float) output.get(new int[]{0, 3, i})[0];

                    // 좌표값 디버깅
                    System.out.println("원시 좌표 #" + i + ": x=" + x + ", y=" + y + ", w=" + w + ", h=" + h);

                    // 좌표 정규화 (0~1 범위로 제한)
                    if (x > 1.0 || y > 1.0 || w > 1.0 || h > 1.0) {
                        System.out.println("좌표 정규화 필요: 640으로 나누기");
                        // YOLOv8이 때로는 0~640 범위의 좌표를 출력할 수 있음
                        x /= 640.0f;
                        y /= 640.0f;
                        w /= 640.0f;
                        h /= 640.0f;
                    }

                    // 좌표 범위 제한 (0~1)
                    x = Math.min(Math.max(x, 0), 1);
                    y = Math.min(Math.max(y, 0), 1);
                    w = Math.min(Math.max(w, 0), 1);
                    h = Math.min(Math.max(h, 0), 1);

                    // 이미지 크기에 맞게 스케일링
                    float centerX = x * imgWidth;
                    float centerY = y * imgHeight;
                    float width = w * imgWidth;
                    float height = h * imgHeight;

                    // 좌상단 좌표 계산
                    float left = centerX - width / 2;
                    float top = centerY - height / 2;

                    // Rect2d 객체 생성
                    Rect2d rect = new Rect2d(left, top, width, height);
                    boxes.add(rect);
                    confidences.add(maxConf);
                    classIds.add(bestClassIdx);
                }
            }

            // 감지된 객체가 있으면 NMS 적용
            if (!boxes.isEmpty()) {
                // MatOfRect2d 및 MatOfFloat 생성
                MatOfRect2d boxesMat = new MatOfRect2d();
                boxesMat.fromList(boxes);

                MatOfFloat confidencesMat = new MatOfFloat();
                float[] confidencesArr = new float[confidences.size()];
                for (int i = 0; i < confidences.size(); i++) {
                    confidencesArr[i] = confidences.get(i);
                }
                confidencesMat.fromArray(confidencesArr);

                // NMS 적용
                MatOfInt indices = new MatOfInt();
                try {
                    Dnn.NMSBoxes(boxesMat, confidencesMat, confThreshold, nmsThreshold, indices);
                } catch (Exception e) {
                    System.err.println("NMS 적용 실패: " + e.getMessage());
                    // 간단한 대안: 모든 감지 사용
                    int[] indicesArr = new int[boxes.size()];
                    for (int i = 0; i < boxes.size(); i++) {
                        indicesArr[i] = i;
                    }
                    indices.fromArray(indicesArr);
                }

                // NMS 결과 처리
                int[] selectedIndices = indices.toArray();
                for (int idx : selectedIndices) {
                    if (idx >= 0 && idx < boxes.size()) {
                        Rect2d box = boxes.get(idx);
                        int classId = classIds.get(idx);
                        float confidence = confidences.get(idx);

                        if(classIds.get(idx) == 0)
                        {
                            //지금 꽃 클래스 트레이닝은 2000개로 해서 검증 편향이 일어나서 꽃에 한해서 임계값 높게 설정.
                            if(confidence < 0.7) continue;
                        }

                        // 클래스 이름 (범위 확인)
                        String label = "unknown";
                        if (classId >= 0 && classId < classes.size()) {
                            label = classes.get(classId);
                        }

                        // 백분율 좌표 계산
                        double x1 = Math.max(0, box.x) / imgWidth * 100;
                        double y1 = Math.max(0, box.y) / imgHeight * 100;
                        double x2 = Math.min(imgWidth, box.x + box.width) / imgWidth * 100;
                        double y2 = Math.min(imgHeight, box.y + box.height) / imgHeight * 100;

                        List<Double> boxCoords = Arrays.asList(x1, y1, x2, y2);
                        results.add(new YoloDetectionResult(label, confidence, boxCoords));

                        System.out.println("감지 #" + idx + ": 클래스=" + label
                                + ", 신뢰도=" + confidence
                                + ", 박스=" + boxCoords);
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("후처리 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
        }

        System.out.println("감지된 객체 수: " + results.size());
        return results;
    }
}