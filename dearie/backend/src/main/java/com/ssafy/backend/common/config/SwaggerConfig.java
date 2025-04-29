package com.ssafy.backend.common.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * API 문서 관련 OpenAPI(Swagger) 설정 정의.
 */
@Configuration
public class SwaggerConfig {

    private static final String SECURITY_SCHEMA_NAME = "JWT";
    private static final String AUTHORIZATION_HEADER = "Authorization";

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("디어리 API 문서")
                        .description("디어리 프로젝트의 API 명세서")
                        .version("1.0.0")
                )
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEMA_NAME)) // 보안 적용
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes(SECURITY_SCHEMA_NAME,
                                new SecurityScheme()
                                        .name(SECURITY_SCHEMA_NAME)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                        ));
    }

    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("public")
                .pathsToMatch("/**")
                .build();
    }
}
