package com.example.project.interceptor;

import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class LoginInterceptor implements HandlerInterceptor {
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        HttpSession session = request.getSession();
        
        // 세션에 로그인 사용자가 없으면 로그인 페이지로 리다이렉트
        if (session.getAttribute("loginUser") == null) {
            response.sendRedirect(request.getContextPath() + "/login");
            return false; // 요청 차단
        }
        
        return true; // 요청 계속 진행
    }
}
