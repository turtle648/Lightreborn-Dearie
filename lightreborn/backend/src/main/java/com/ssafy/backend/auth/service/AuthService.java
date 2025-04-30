package com.ssafy.backend.auth.service;

import com.ssafy.backend.auth.model.dto.request.SignUpDTO;

public interface AuthService {
    void signup(SignUpDTO signUpDTO);
}
