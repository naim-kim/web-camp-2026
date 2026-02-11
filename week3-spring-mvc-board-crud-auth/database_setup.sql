-- Week 3: Spring MVC 게시판 + 로그인 프로젝트 DB 설정
-- MariaDB에서 실행하세요: mysql -u root -p < database_setup.sql

CREATE DATABASE IF NOT EXISTS spring_board
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE spring_board;

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
  username VARCHAR(50) PRIMARY KEY,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(10) DEFAULT 'USER', -- 'USER' or 'ADMIN'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 게시판 테이블
CREATE TABLE IF NOT EXISTS board (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  content TEXT,
  writer VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (writer) REFERENCES users(username) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 테스트 데이터 (선택사항)
-- 비밀번호는 평문 "password" (실제 운영에서는 BCrypt 등으로 암호화 필요)
INSERT INTO users (username, password, role) VALUES
('admin', 'password', 'ADMIN'),
('user1', 'password', 'USER'),
('user2', 'password', 'USER');

INSERT INTO board (title, content, writer) VALUES
('첫 번째 게시글', '안녕하세요! 첫 번째 게시글입니다.', 'user1'),
('두 번째 게시글', 'Spring MVC 게시판 프로젝트입니다.', 'user2'),
('관리자 공지', '관리자 공지사항입니다.', 'admin');
