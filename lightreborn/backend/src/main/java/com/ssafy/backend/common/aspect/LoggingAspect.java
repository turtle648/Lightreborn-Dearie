package com.ssafy.backend.common.aspect;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Slf4j
@Aspect
@Component
public class LoggingAspect {

    // ✅ 컨트롤러(@RestController) 메서드 실행 시 적용
    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *)")
    public void controllerMethods() {}

    // ✅ HTTP 요청 로깅 (Before 사용)
    @Before("controllerMethods()")
    public void logRequest(JoinPoint joinPoint) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            log.info("[Request] {} {}", request.getMethod(), request.getRequestURI());
        }
    }

    // ✅ HTTP 요청 실행 시간 로깅 (Around 사용)
    @Around("controllerMethods()")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();

        Object result = joinPoint.proceed(); // 컨트롤러 메서드 실행

        long elapsedTime = System.currentTimeMillis() - start;
        log.info("[Execution Time] {} took {} ms", joinPoint.getSignature(), elapsedTime);

        return result;
    }
}
