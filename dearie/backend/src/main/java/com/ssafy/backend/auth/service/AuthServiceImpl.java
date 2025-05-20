package com.ssafy.backend.auth.service;

import com.ssafy.backend.auth.model.dto.response.UserActivityDTO;
import com.ssafy.backend.auth.model.entity.User;
import com.ssafy.backend.auth.exception.AuthErrorCode;
import com.ssafy.backend.auth.exception.AuthException;
import com.ssafy.backend.auth.model.dto.request.LoginRequestDTO;
import com.ssafy.backend.auth.model.dto.request.SignUpDTO;
import com.ssafy.backend.auth.model.dto.response.LoginResponseDTO;
import com.ssafy.backend.auth.model.vo.SignUpVO;
import com.ssafy.backend.auth.repository.UserRepository;
import com.ssafy.backend.diary.reader.DiaryReader;
import com.ssafy.backend.mission.reader.UserMissionReader;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService{
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final DiaryReader diaryReader;
    private final UserMissionReader userMissionReader;

    @Override
    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {
        User user = userRepository.findByLoginId(loginRequestDTO.getId()).orElseThrow(() -> new AuthException(AuthErrorCode.USER_NOT_FOUND));

        if(!passwordEncoder.matches(loginRequestDTO.getPassword(), user.getPassword())) {
            log.error("[AuthServiceImpl] 사용자를 찾을 수 없습니다: {}", loginRequestDTO);
            throw new AuthException(AuthErrorCode.PASSWORD_NOT_MATCH);
        }

        return LoginResponseDTO.builder()
                .id(user.getLoginId())
                .name(user.getName())
                .build();
    }

    @Override
    public void signup(SignUpDTO signUpDTO) {
        userRepository.findByLoginId(signUpDTO.getId())
                .ifPresent(user -> {
                    log.error("[AuthServiceImpl] 이미 존재하는 사용자 입니다: {}", signUpDTO);
                    throw new AuthException(AuthErrorCode.USER_ALREADY_EXISTS);
                });


        SignUpVO signUpVO = SignUpVO.of(
                signUpDTO.getId(),
                signUpDTO.getPassword(),
                signUpDTO.getName(),
                signUpDTO.getNickName(),
                signUpDTO.toGenderEnum(),
                signUpDTO.getBirthDate(),
                signUpDTO.getPhoneNumber(),
                signUpDTO.getEmergencyContact()
        );

        userRepository.save(
                signUpVO.toEntity(passwordEncoder.encode(signUpVO.getPassword()))
        );
    }

    @Override
    public LoginResponseDTO findUser(String loginUser) {
        User user = userRepository.findByLoginId(loginUser).orElseThrow(() -> {
            log.error("[AuthServiceImpl] 사용자를 찾을 수 없습니다: {}", loginUser);

            return new AuthException(AuthErrorCode.USER_NOT_FOUND);
        });

        log.info("[AuthServiceImpl] 사용자를 찾았습니다: {}", user);

        Integer diaryCount = diaryReader.getCountByUserId(user.getId());
        Integer completeMissionCount = userMissionReader.getUserCompletedMissionCount(user.getId());
        Integer consecutiveCount = diaryReader.getCountConsecutiveDiaryDays(user.getId());

        UserActivityDTO userActivityDTO = UserActivityDTO.from(diaryCount, completeMissionCount, consecutiveCount);

        return LoginResponseDTO.from(user, userActivityDTO);
    }
}
