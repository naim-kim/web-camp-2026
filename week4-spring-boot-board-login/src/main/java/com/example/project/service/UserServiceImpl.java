package com.example.project.service;

import com.example.project.domain.User;
import com.example.project.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    
    private final UserMapper userMapper;
    
    @Autowired
    public UserServiceImpl(UserMapper userMapper) {
        this.userMapper = userMapper;
    }
    
    @Override
    public User login(String username, String password) {
        User user = userMapper.findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }
    
    @Override
    public void register(User user) {
        // 기본 role이 없으면 USER로 설정
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }
        userMapper.insert(user);
    }
    
    @Override
    public boolean exists(String username) {
        return userMapper.countByUsername(username) > 0;
    }
}
