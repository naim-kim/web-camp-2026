package com.example.project.mapper;

import com.example.project.domain.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {
    User findByUsername(String username);
    void insert(User user);
    int countByUsername(String username);
}
