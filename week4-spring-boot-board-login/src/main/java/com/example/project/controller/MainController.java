package com.example.project.controller;

import com.example.project.domain.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpSession;

@Controller
public class MainController {
    
    @GetMapping("/")
    public String home(HttpSession session, Model model) {
        User user = (User) session.getAttribute("loginUser");
        if (user != null) {
            model.addAttribute("username", user.getUsername());
            model.addAttribute("role", user.getRole());
        }
        return "main";
    }
}
