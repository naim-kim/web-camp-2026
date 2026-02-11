package com.example.project.controller;

import com.example.project.domain.Board;
import com.example.project.domain.User;
import com.example.project.service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpSession;

@Controller
@RequestMapping("/board")
public class BoardController {
    
    private final BoardService boardService;
    
    @Autowired
    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }
    
    // 게시판 목록
    @GetMapping("/list")
    public String list(Model model, HttpSession session) {
        model.addAttribute("boards", boardService.getAllBoards());
        User user = (User) session.getAttribute("loginUser");
        if (user != null) {
            model.addAttribute("username", user.getUsername());
            model.addAttribute("role", user.getRole());
        }
        return "board/list";
    }
    
    // 게시글 상세
    @GetMapping("/{id}")
    public String detail(@PathVariable Integer id, Model model, HttpSession session) {
        Board board = boardService.getBoardById(id);
        if (board == null) {
            return "redirect:/board/list";
        }
        model.addAttribute("board", board);
        User user = (User) session.getAttribute("loginUser");
        if (user != null) {
            model.addAttribute("username", user.getUsername());
            model.addAttribute("role", user.getRole());
            // 작성자와 로그인 사용자가 같거나 관리자인지 확인
            model.addAttribute("canEdit", user.getUsername().equals(board.getWriter()) || "ADMIN".equals(user.getRole()));
        }
        return "board/detail";
    }
    
    // 게시글 작성 폼
    @GetMapping("/create")
    public String createForm(Model model, HttpSession session) {
        User user = (User) session.getAttribute("loginUser");
        if (user == null) {
            return "redirect:/login";
        }
        model.addAttribute("board", new Board());
        return "board/create";
    }
    
    // 게시글 작성 처리
    @PostMapping("/create")
    public String create(@ModelAttribute Board board, HttpSession session) {
        User user = (User) session.getAttribute("loginUser");
        if (user == null) {
            return "redirect:/login";
        }
        board.setWriter(user.getUsername());
        boardService.createBoard(board);
        return "redirect:/board/list";
    }
    
    // 게시글 수정 폼
    @GetMapping("/{id}/update")
    public String updateForm(@PathVariable Integer id, Model model, HttpSession session, RedirectAttributes redirectAttributes) {
        Board board = boardService.getBoardById(id);
        if (board == null) {
            redirectAttributes.addFlashAttribute("error", "게시글을 찾을 수 없습니다.");
            return "redirect:/board/list";
        }
        
        User user = (User) session.getAttribute("loginUser");
        if (user == null || (!user.getUsername().equals(board.getWriter()) && !"ADMIN".equals(user.getRole()))) {
            redirectAttributes.addFlashAttribute("error", "수정 권한이 없습니다.");
            return "redirect:/board/" + id;
        }
        
        model.addAttribute("board", board);
        return "board/update";
    }
    
    // 게시글 수정 처리
    @PostMapping("/{id}/update")
    public String update(@PathVariable Integer id, @ModelAttribute Board board, HttpSession session, RedirectAttributes redirectAttributes) {
        Board existingBoard = boardService.getBoardById(id);
        if (existingBoard == null) {
            redirectAttributes.addFlashAttribute("error", "게시글을 찾을 수 없습니다.");
            return "redirect:/board/list";
        }
        
        User user = (User) session.getAttribute("loginUser");
        if (user == null || (!user.getUsername().equals(existingBoard.getWriter()) && !"ADMIN".equals(user.getRole()))) {
            redirectAttributes.addFlashAttribute("error", "수정 권한이 없습니다.");
            return "redirect:/board/" + id;
        }
        
        board.setId(id);
        board.setWriter(existingBoard.getWriter()); // 작성자는 변경하지 않음
        boardService.updateBoard(board);
        return "redirect:/board/" + id;
    }
    
    // 게시글 삭제
    @PostMapping("/{id}/delete")
    public String delete(@PathVariable Integer id, HttpSession session, RedirectAttributes redirectAttributes) {
        Board board = boardService.getBoardById(id);
        if (board == null) {
            redirectAttributes.addFlashAttribute("error", "게시글을 찾을 수 없습니다.");
            return "redirect:/board/list";
        }
        
        User user = (User) session.getAttribute("loginUser");
        if (user == null || (!user.getUsername().equals(board.getWriter()) && !"ADMIN".equals(user.getRole()))) {
            redirectAttributes.addFlashAttribute("error", "삭제 권한이 없습니다.");
            return "redirect:/board/" + id;
        }
        
        boardService.deleteBoard(id);
        redirectAttributes.addFlashAttribute("message", "게시글이 삭제되었습니다.");
        return "redirect:/board/list";
    }
}
