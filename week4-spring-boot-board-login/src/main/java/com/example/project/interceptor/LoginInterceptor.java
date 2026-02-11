package com.example.project.interceptor;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class LoginInterceptor implements HandlerInterceptor {
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        HttpSession session = request.getSession();
        
        // 세션에 로그인 사용자가 없으면 로그인 페이지로 리다이렉트
        if (session.getAttribute("loginUser") == null) {
            // 원래 가려던 URL을 redirectURL 파라미터로 저장
            String requestURI = request.getRequestURI();
            String queryString = request.getQueryString();
            
            // 쿼리 스트링이 있으면 함께 저장
            String redirectURL = requestURI;
            if (queryString != null && !queryString.isEmpty()) {
                redirectURL += "?" + queryString;
            }
            
            // 로그인 페이지로 리다이렉트 (원래 URL 정보 포함)
            String encodedURL = URLEncoder.encode(redirectURL, StandardCharsets.UTF_8.toString());
            response.sendRedirect(request.getContextPath() + "/login?redirectURL=" + encodedURL);
            return false; // 요청 차단
        }
        
        return true; // 요청 계속 진행
    }
}
