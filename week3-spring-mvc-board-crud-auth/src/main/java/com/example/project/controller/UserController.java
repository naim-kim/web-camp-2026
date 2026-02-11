package com.example.project.controller;

import com.example.project.domain.User;
import com.example.project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpSession;

@Controller
public class UserController {
    
    private final UserService userService;
    
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    // 로그인 폼
    @GetMapping("/login")
    public String loginForm(HttpSession session) {
        // 이미 로그인한 경우 메인으로 리다이렉트
        if (session.getAttribute("loginUser") != null) {
            return "redirect:/";
        }
        return "login";
    }
    
    // 로그인 처리
    @PostMapping("/login")
    public String login(@RequestParam String username,
                       @RequestParam String password,
                       HttpSession session,
                       RedirectAttributes redirectAttributes) {
        User user = userService.login(username, password);
        
        if (user != null) {
            // 로그인 성공: 세션에 사용자 정보 저장
            session.setAttribute("loginUser", user);
            return "redirect:/";
        } else {
            // 로그인 실패
            redirectAttributes.addFlashAttribute("error", "아이디 또는 비밀번호가 올바르지 않습니다.");
            return "redirect:/login";
        }
    }
    
    // 회원가입 폼
    @GetMapping("/register")
    public String registerForm(HttpSession session) {
        // 이미 로그인한 경우 메인으로 리다이렉트
        if (session.getAttribute("loginUser") != null) {
            return "redirect:/";
        }
        return "register";
    }
    
    // 회원가입 처리
    @PostMapping("/register")
    public String register(@RequestParam String username,
                          @RequestParam String password,
                          RedirectAttributes redirectAttributes) {
        // 중복 체크
        if (userService.exists(username)) {
            redirectAttributes.addFlashAttribute("error", "이미 존재하는 아이디입니다.");
            return "redirect:/register";
        }
        
        // 새 사용자 등록
        User user = new User(username, password, "USER");
        userService.register(user);
        
        redirectAttributes.addFlashAttribute("message", "회원가입이 완료되었습니다. 로그인해주세요.");
        return "redirect:/login";
    }
    
    // 로그아웃
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/";
    }
}
