package com.ssafy.backend.common.client;

import ai.djl.MalformedModelException;
import ai.djl.Model;
import ai.djl.inference.Predictor;
import ai.djl.modality.cv.ImageFactory;
import ai.djl.modality.cv.output.DetectedObjects;
import ai.djl.modality.cv.output.DetectedObjects.DetectedObject;
import ai.djl.modality.cv.transform.Normalize;
import ai.djl.modality.cv.transform.Resize;
import ai.djl.modality.cv.translator.YoloV5Translator;
import ai.djl.modality.cv.Image;
import ai.djl.translate.TranslateException;
import ai.djl.translate.Translator;
import com.ssafy.backend.common.client.dto.YoloDetectionResult;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class YoloInferenceService {

    private Predictor<Image, DetectedObjects> predictor;

    @PostConstruct
    public void init() throws IOException, MalformedModelException {
        // 1) Translator: 전처리(yolo 모델에 맞는 이미지로 리사이즈, 정규화) + 후처리(Yolo-specific NMS 등)
        Translator<Image, DetectedObjects> translator = YoloV5Translator.builder()
                .optSynsetArtifactName("custom.names")
                .addTransform(new Resize(640, 640))
                .addTransform(new Normalize(
                        new float[]{0f,0f,0f}, new float[]{255f,255f,255f}))
                .build();

//        // 2) Model 로드
//        Model model = Model.newInstance("yolo-custom");
//        model.load(Paths.get("src/main/resources/models"), "best.onnx");
//
//        // 3) Predictor 생성
//        predictor = model.newPredictor(translator);
    }

    /**
     * URL에서 이미지를 읽어 YOLO 추론 후,
     * 도메인 DetectedObject 리스트로 반환
     */
    public List<YoloDetectionResult> detect(String imageUrl)
            throws IOException, TranslateException {
        // 1) URL → DJL Image
        Image img = ImageFactory.getInstance().fromUrl(imageUrl);
        // 2) 예측 수행
        DetectedObjects djlResults = predictor.predict(img);

        // 3) DJL 결과 → 도메인 VO 변환
        return djlResults.items().stream()
                .map(item -> {
                    DetectedObject djlObj = (DetectedObject) item;
                    var box = djlObj.getBoundingBox().getBounds();  // java.awt.geom.Rectangle2D
                    var coords = List.of(
                            box.getX(), box.getY(),
                            box.getWidth(), box.getHeight()
                    );
                    return new YoloDetectionResult(
                            djlObj.getClassName(),
                            djlObj.getProbability(),
                            coords
                    );
                })
                .collect(Collectors.toList());
    }
}
