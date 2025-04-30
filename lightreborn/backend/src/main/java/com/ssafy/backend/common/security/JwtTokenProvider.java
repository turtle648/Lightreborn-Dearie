package com.ssafy.backend.common.security;

import com.ssafy.backend.auth.entity.User;
import com.ssafy.backend.auth.repository.UserRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    private static final int EXPIRATION_TIME = 60 * 60 * 24; // ✅ 24시간

    private final Key key;
    private final UserRepository userRepository;

    public JwtTokenProvider(@Value("${jwt.secret-key}") String secretKey, UserRepository userRepository) {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes());
        this.userRepository = userRepository;
    }

    public String generateToken(String userId) {
        return Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME * 1000L))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public HttpServletResponse sendTokenAsCookie(HttpServletResponse response, String jwtToken) {
        boolean isDev = activeProfile.equals("dev");

        String cookieValue = "access_token=" + jwtToken
                + "; Path=/"
                + "; HttpOnly"
                + "; Secure"
                + "; Max-Age=" + EXPIRATION_TIME;

        if(!isDev){
            cookieValue += "; SameSite=None";
        }

        response.setHeader("Set-Cookie", cookieValue);
        return response;
    }

    public String extractTokenFromCookie(HttpServletRequest request) {
        if(request.getCookies() == null) return null;

        for(Cookie cookie: request.getCookies()) {
            if("access_token".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
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

    // ✅ JWT에서 인증 정보 가져오기
    public Authentication getAuthentication(UserDetails userDetails) {
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
}
