package com.ssafy.backend.auth.service;

import com.ssafy.backend.auth.model.dto.request.LoginRequestDTO;
import com.ssafy.backend.auth.model.dto.request.SignUpDTO;
import com.ssafy.backend.auth.model.dto.response.LoginResponseDTO;

public interface AuthService {
    LoginResponseDTO login(LoginRequestDTO loginRequestDTO);
    void signup(SignUpDTO signUpDTO);
}
