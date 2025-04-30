package com.ssafy.backend.auth.service;

import com.ssafy.backend.auth.entity.User;
import com.ssafy.backend.auth.exception.AuthErrorCode;
import com.ssafy.backend.auth.exception.AuthException;
import com.ssafy.backend.auth.model.dto.request.LoginRequestDTO;
import com.ssafy.backend.auth.model.dto.request.SignUpDTO;
import com.ssafy.backend.auth.model.dto.response.LoginResponseDTO;
import com.ssafy.backend.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {
        User user = userRepository.findByUserId(loginRequestDTO.getId()).orElseThrow(() -> new AuthException(AuthErrorCode.USER_NOT_FOUND));

        if(!passwordEncoder.matches(loginRequestDTO.getPassword(), user.getPassword())) {
            throw new AuthException(AuthErrorCode.PASSWORD_NOT_MATCH);
        }

        return LoginResponseDTO.builder().id(user.getUserId()).build();
    }

    @Override
    public void signup(SignUpDTO signUpDTO) {
        userRepository.findByUserId(signUpDTO.getId())
                .ifPresent(user -> {
                    throw new AuthException(AuthErrorCode.USER_ALREADY_EXISTS);
                });

        User user = new User();

        user.setUserId(signUpDTO.getId());
        user.setPassword(passwordEncoder.encode(signUpDTO.getPassword()));
        user.setRole(signUpDTO.getRole());

        userRepository.save(user);
    }

    @Override
    public LoginResponseDTO findUser(String loginUser) {
        User user = userRepository.findByUserId(loginUser).orElseThrow(() -> new AuthException(AuthErrorCode.USER_NOT_FOUND));
        return LoginResponseDTO.builder().id(user.getUserId()).build();
    }
}
