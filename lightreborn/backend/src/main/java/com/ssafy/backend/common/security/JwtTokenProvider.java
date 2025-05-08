package com.ssafy.backend.common.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
public class JwtTokenProvider {
    @Value("${spring.profiles.active:local}")
    private String activeProfile;

    public static final int EXPIRATION_TIME = 60 * 60 * 24;

    private final Key key;
    private final RedisTemplate<String, Object> redisTemplate;

    public JwtTokenProvider(@Value("${jwt.secret-key}") String secretKey,
                            RedisTemplate<String, Object> redisTemplate) {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes());
        this.redisTemplate = redisTemplate;
    }

    public String generateToken(String userId) {
        return Jwts.builder()
                .setSubject(userId)
                .claim("role", "user")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME * 1000L))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public ResponseCookie generateTokenCookie(String jwtToken) {
        boolean isDev = activeProfile.equals("local");

        return ResponseCookie.from("access_token", jwtToken)
                .httpOnly(true)
                .secure(false)
//                .secure(!isDev ? true : false)
                .path("/")
                .maxAge(EXPIRATION_TIME)
                .sameSite(isDev ? "Lax" : "None")
                .build();
    }

    public ResponseCookie expiredTokenCookie(String jwtToken) {
        boolean isDev = activeProfile.equals("local");

        long remainTime = getRemainingExpiration(jwtToken);
        String blacklistKey = "blacklist:" + DigestUtils.sha256Hex(jwtToken);
        redisTemplate.opsForValue().set(blacklistKey, "logout", remainTime, TimeUnit.MILLISECONDS);

        return ResponseCookie.from("access_token", jwtToken)
                .httpOnly(true)
                .secure(!isDev)
                .path("/")
                .maxAge(0)
                .sameSite(isDev ? "Lax" : "None")
                .build();
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

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);

            String blacklistKey = "blacklist:" + DigestUtils.sha256Hex(token);
            Object status = redisTemplate.opsForValue().get(blacklistKey);

            return !"logout".equals(status);
        } catch (JwtException e) {
            return false;
        }
    }

    public long getRemainingExpiration(String token) {
        Date expiration = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();

        return expiration.getTime() - System.currentTimeMillis();
    }

    public String getUserIdFromToken(String token) {
        return getClaims(token).getSubject();
    }

    public Claims getClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException e) {
            throw new IllegalArgumentException("유효하지 않은 JWT 토큰입니다", e);
        }
    }

}
