package com.example.project.mapper;

import com.example.project.domain.Board;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BoardMapper {
    List<Board> findAll();
    Board findById(Integer id);
    void insert(Board board);
    void update(Board board);
    void delete(Integer id);
}
