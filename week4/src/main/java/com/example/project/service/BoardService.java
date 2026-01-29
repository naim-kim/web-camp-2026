package com.example.project.service;

import com.example.project.domain.Board;

import java.util.List;

public interface BoardService {
    List<Board> getAllBoards();
    Board getBoardById(Integer id);
    void createBoard(Board board);
    void updateBoard(Board board);
    void deleteBoard(Integer id);
}
