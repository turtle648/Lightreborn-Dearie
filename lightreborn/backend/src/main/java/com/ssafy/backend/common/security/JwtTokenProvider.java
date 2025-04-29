package com.ssafy.backend.common.security;

import com.ssafy.backend.auth.entity.User;
import com.ssafy.backend.auth.repository.UserRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Slf4j
@Component
public class JwtTokenProvider {

    private static final String SECRET_KEY = "your-256-bit-secret-your-256-bit-secret"; // ✅ 256-bit 키 사용 필수
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24; // ✅ 24시간

    private final Key key;
    private final UserRepository userRepository;

    public JwtTokenProvider(UserRepository userRepository) {
        this.key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
        this.userRepository = userRepository;
    }

    // ✅ JWT 토큰 생성
    public String generateToken(String userId) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ JWT 토큰 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }


    public String getUserIdFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // ✅ JWT에서 사용자 user 추출
    public User getUserFromToken(String token){
        // 접두어 Bearer 제거
        if (token.startsWith("Bearer ")){
            token = token.substring(7);
        }

        // JWT에서 userId 추출
        String userId = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();


        // userId를 이용해 User 객체 조회
        return userRepository.findByUserId(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with ID: " + userId));
    }

    public User getUserFromRequest(HttpServletRequest request) {
        String accessToken = request.getHeader("Authorization");

        if (accessToken == null || !accessToken.startsWith("Bearer ")) {
            throw new UsernameNotFoundException("No valid Authorization token found");
        }

        return getUserFromToken(accessToken);
    }

    // ✅ JWT에서 인증 정보 가져오기
    public Authentication getAuthentication(UserDetails userDetails) {
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
}
