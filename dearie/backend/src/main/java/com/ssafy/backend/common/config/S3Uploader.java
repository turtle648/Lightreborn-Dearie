package com.ssafy.backend.common.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.async.AsyncRequestBody;
import software.amazon.awssdk.services.s3.S3AsyncClient;
import software.amazon.awssdk.services.s3.S3Utilities;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ForkJoinPool;

@Component
@RequiredArgsConstructor
public class S3Uploader {

    private final S3AsyncClient s3AsyncClient;
    private final S3Utilities  s3Utilities;

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucketName;

    /**
     * MultipartFile 업로드 → 내부적으로 byte[] 로
     */
    public String upload(String key, MultipartFile file) {
        System.out.println("⭐버킷 이름 : " + bucketName);
        try {
            byte[] data = file.getBytes();
            String contentType = file.getContentType();
            return uploadBytes(key, data, contentType);
        } catch (IOException e) {
            throw new RuntimeException("❤️Failed to read MultipartFile for S3 upload", e);
        }
    }

    /**
     * 바이트 배열 업로드 (예: JSON, 작은 바이너리)
     */
    public String uploadBytes(String key, byte[] data, String contentType) {
        System.out.println("❤️ uploadBytes 실행 됨 - " + key);
        PutObjectRequest por = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(contentType)
                .build();

        // fromBytes 로 간단히 업로드
        s3AsyncClient.putObject(por, AsyncRequestBody.fromBytes(data))
                .join();  // 비동기 완료 대기

        return buildUrl(key);
    }

    /**
     * InputStream 업로드 (예: 대용량 스트림) — ExecutorService 필요
     */
    public String uploadStream(String key,
                               InputStream inputStream,
                               long contentLength,
                               String contentType) {
        PutObjectRequest por = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentLength(contentLength)
                .contentType(contentType)
                .build();

        try {
            // ForkJoinPool.commonPool() 을 ExecutorService 로 넘김
            s3AsyncClient.putObject(
                    por,
                    AsyncRequestBody.fromInputStream(
                            inputStream,
                            contentLength,
                            ForkJoinPool.commonPool()
                    )
            ).get();  // 업로드 완료 대기
        } catch (InterruptedException | ExecutionException ex) {
            throw new RuntimeException("S3 upload failed", ex);
        }

        return buildUrl(key);
    }

    private String buildUrl(String key) {
        GetUrlRequest urlReq = GetUrlRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();
        return s3Utilities.getUrl(urlReq)
                .toExternalForm();
    }

    /**
     * JSON 전용 헬퍼: 내부에서 uploadBytes 를 바로 쓰도록 편의 메서드 추가
     */
    public String uploadJson(String key, String json) {
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        return uploadBytes(key, bytes, "application/json");
    }
}
