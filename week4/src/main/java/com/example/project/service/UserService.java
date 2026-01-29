package com.example.project.service;

import com.example.project.domain.User;

public interface UserService {
    User login(String username, String password);
    void register(User user);
    boolean exists(String username);
}
