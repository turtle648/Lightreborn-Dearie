package com.ssafy.backend.auth.controller;

import com.ssafy.backend.auth.model.dto.request.LoginRequestDTO;
import com.ssafy.backend.auth.model.dto.request.SignUpDTO;
import com.ssafy.backend.auth.model.dto.response.LoginResponseDTO;
import com.ssafy.backend.auth.service.AuthService;
import com.ssafy.backend.common.dto.BaseResponse;
import com.ssafy.backend.common.security.CustomUserDetails;
import com.ssafy.backend.common.security.JwtTokenProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
@Tag(name = "Auth", description = "인증 관련 API (회원가입, 로그인 등)")
public class AuthController {
    private final JwtTokenProvider provider;
    private final AuthService authService;

    @Operation(summary = "회원가입 API", description = "신규 사용자를 등록합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "회원가입 성공"),
            @ApiResponse(responseCode = "400", description = "요청 값 오류"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @PostMapping("/signup")
    public ResponseEntity<BaseResponse<String>> signUp(@Valid @RequestBody SignUpDTO signUpDTO) {
        authService.signup(signUpDTO);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(BaseResponse.success(201,"회원가입이 완료되었습니다"));
    }

    @PostMapping("/logout")
    public ResponseEntity<BaseResponse<String>> logout(@CookieValue(name = "access_token", required = false) String token) {
        ResponseCookie cookie = provider.expiredTokenCookie(token);

        return ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString())
                .body(BaseResponse.success(200,"로그아웃이 완료되었습니다"));
    }

    @PostMapping("/login")
    public ResponseEntity<BaseResponse<LoginResponseDTO>> login(@Valid @RequestBody LoginRequestDTO loginDTO) {
        LoginResponseDTO loginResponseDTO = authService.login(loginDTO);

        String jwt = provider.generateToken(loginResponseDTO.getId());
        ResponseCookie cookieValue = provider.generateTokenCookie(jwt);

        return ResponseEntity.ok()
                .header("Set-Cookie", cookieValue.toString())
                .body(BaseResponse.success(200, "로그인이 완료되었습니다", loginResponseDTO));
    }

    @GetMapping("/me")
    public ResponseEntity<BaseResponse<LoginResponseDTO>> getUserInfo(@AuthenticationPrincipal CustomUserDetails userDetails) {
        String loginUser = userDetails.getUserId();

        LoginResponseDTO info = authService.findUser(loginUser);

        return ResponseEntity.ok()
                .body(BaseResponse.success(200,"본인 정보 조회를 완료하였습니다", info));
    }
}
