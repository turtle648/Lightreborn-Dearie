package com.ssafy.backend.common.S3;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Client s3Client;
    private final String bucket = "dearie-bucket";

    public String upload(MultipartFile file) {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        try {
            s3Client.putObject(
                PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(fileName)
                    .acl("public-read")
                    .contentType(file.getContentType())
                    .build(),
                RequestBody.fromBytes(file.getBytes())
            );

            return "https://" + bucket + ".s3.ap-northeast-2.amazonaws.com/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("S3 업로드 실패", e);
        }
    }
}
