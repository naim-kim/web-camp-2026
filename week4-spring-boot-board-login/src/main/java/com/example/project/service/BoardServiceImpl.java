package com.example.project.service;

import com.example.project.domain.Board;
import com.example.project.mapper.BoardMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BoardServiceImpl implements BoardService {
    
    private final BoardMapper boardMapper;
    
    @Autowired
    public BoardServiceImpl(BoardMapper boardMapper) {
        this.boardMapper = boardMapper;
    }
    
    @Override
    public List<Board> getAllBoards() {
        return boardMapper.findAll();
    }
    
    @Override
    public Board getBoardById(Integer id) {
        return boardMapper.findById(id);
    }
    
    @Override
    public void createBoard(Board board) {
        boardMapper.insert(board);
    }
    
    @Override
    public void updateBoard(Board board) {
        boardMapper.update(board);
    }
    
    @Override
    public void deleteBoard(Integer id) {
        boardMapper.delete(id);
    }
}
