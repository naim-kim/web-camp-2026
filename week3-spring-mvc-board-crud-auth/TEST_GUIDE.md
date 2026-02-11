# Week 3 프로젝트 테스트 가이드

## 📋 테스트 전 체크리스트

- [ ] MariaDB 실행 중
- [ ] Tomcat 9 설치 및 실행 가능
- [ ] Maven 설치 확인 (`mvn -version`)

---

## 🔧 1단계: 데이터베이스 설정

### 방법 1: SQL 파일 실행 (권장)
```bash
cd week3
mysql -u root -p < database_setup.sql
```
비밀번호 입력 후 실행

### 방법 2: MariaDB 직접 접속
```bash
mysql -u root -p
```

그 다음 SQL 실행:
```sql
CREATE DATABASE IF NOT EXISTS spring_board
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE spring_board;

CREATE TABLE IF NOT EXISTS users (
  username VARCHAR(50) PRIMARY KEY,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(10) DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS board (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  content TEXT,
  writer VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (writer) REFERENCES users(username) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 테스트 데이터 삽입
INSERT INTO users (username, password, role) VALUES
('admin', 'password', 'ADMIN'),
('user1', 'password', 'USER'),
('user2', 'password', 'USER');

INSERT INTO board (title, content, writer) VALUES
('첫 번째 게시글', '안녕하세요! 첫 번째 게시글입니다.', 'user1'),
('두 번째 게시글', 'Spring MVC 게시판 프로젝트입니다.', 'user2'),
('관리자 공지', '관리자 공지사항입니다.', 'admin');
```

### DB 확인
```sql
USE spring_board;
SELECT * FROM users;
SELECT * FROM board;
```

---

## 🏗️ 2단계: 프로젝트 빌드

### PowerShell에서 실행:
```powershell
cd "C:\Users\User\GitHub\WebCamp\web-camp-2026\week3"
mvn clean package
```

**성공 메시지 확인:**
```
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

**WAR 파일 확인:**
```powershell
dir target\spring-legacy-crud-1.0.0.war
```

---

## 🚀 3단계: Tomcat 배포

### 3-1. WAR 파일 복사
```powershell
Copy-Item -Force .\target\spring-legacy-crud-1.0.0.war "C:\Users\User\apache-tomcat-9.0.107\webapps\"
```

### 3-2. Tomcat 실행
```powershell
cd "C:\Users\User\apache-tomcat-9.0.107\bin"
.\startup.bat
```

**Tomcat 실행 확인:**
브라우저에서 `http://localhost:8080` 접속 → Tomcat 메인 페이지가 보이면 성공

---

## 🧪 4단계: 기능 테스트

### 테스트 계정
| 아이디 | 비밀번호 | 역할 |
|--------|----------|------|
| admin | password | ADMIN |
| user1 | password | USER |
| user2 | password | USER |

---

### ✅ 테스트 시나리오 1: 메인 페이지
**URL:** `http://localhost:8080/spring-legacy-crud-1.0.0/`

**예상 결과:**
- 로그인하지 않은 상태: "로그인", "회원가입" 버튼 표시
- 로그인 후: 사용자명과 역할 표시, "게시판", "로그아웃" 버튼 표시

---

### ✅ 테스트 시나리오 2: 회원가입
**URL:** `http://localhost:8080/spring-legacy-crud-1.0.0/register`

**테스트:**
1. 새 아이디로 회원가입 (예: `testuser`, 비밀번호: `password`)
2. 성공 시 로그인 페이지로 리다이렉트
3. 중복 아이디로 회원가입 시도 → 에러 메시지 표시

---

### ✅ 테스트 시나리오 3: 로그인
**URL:** `http://localhost:8080/spring-legacy-crud-1.0.0/login`

**테스트:**
1. `admin` / `password`로 로그인
2. 성공 시 메인 페이지로 이동, "admin님 환영합니다!" 표시
3. 잘못된 비밀번호 입력 → 에러 메시지 표시

---

### ✅ 테스트 시나리오 4: Interceptor 동작 확인
**URL:** `http://localhost:8080/spring-legacy-crud-1.0.0/board/list`

**테스트:**
1. **로그인하지 않은 상태에서 접근:**
   - 자동으로 `/login` 페이지로 리다이렉트 ✅

2. **로그인 후 접근:**
   - 게시판 목록이 정상적으로 표시됨 ✅

---

### ✅ 테스트 시나리오 5: 게시판 목록
**URL:** `http://localhost:8080/spring-legacy-crud-1.0.0/board/list`

**예상 결과:**
- 3개의 테스트 게시글이 표시됨
- 제목, 작성자, 작성일이 표시됨
- "새 글 작성" 버튼 표시

---

### ✅ 테스트 시나리오 6: 게시글 작성
**URL:** `http://localhost:8080/spring-legacy-crud-1.0.0/board/create`

**테스트:**
1. 제목: "테스트 게시글"
2. 내용: "이것은 테스트입니다."
3. 작성 버튼 클릭
4. 목록으로 리다이렉트되고 새 게시글이 맨 위에 표시됨
5. 작성자 = 로그인한 사용자명 확인

---

### ✅ 테스트 시나리오 7: 게시글 상세 보기
**URL:** `http://localhost:8080/spring-legacy-crud-1.0.0/board/1`

**예상 결과:**
- 게시글 제목, 내용, 작성자, 작성일 표시
- 작성자이거나 ADMIN인 경우 "수정", "삭제" 버튼 표시
- 다른 사용자의 게시글은 버튼이 보이지 않음

---

### ✅ 테스트 시나리오 8: 게시글 수정
**URL:** `http://localhost:8080/spring-legacy-crud-1.0.0/board/1/update`

**테스트:**
1. `user1`로 로그인
2. `user1`이 작성한 게시글(첫 번째 게시글) 수정 가능 ✅
3. `user2`가 작성한 게시글 수정 시도 → 권한 없음 메시지 ✅
4. `admin`으로 로그인 → 모든 게시글 수정 가능 ✅

---

### ✅ 테스트 시나리오 9: 게시글 삭제
**URL:** 게시글 상세 페이지에서 "삭제" 버튼 클릭

**테스트:**
1. `user1`로 로그인
2. 본인이 작성한 게시글 삭제 가능 ✅
3. 다른 사용자의 게시글 삭제 시도 → 권한 없음 ✅
4. `admin`으로 로그인 → 모든 게시글 삭제 가능 ✅

---

### ✅ 테스트 시나리오 10: 로그아웃
**URL:** `http://localhost:8080/spring-legacy-crud-1.0.0/logout`

**테스트:**
1. 로그인 상태에서 로그아웃 클릭
2. 메인 페이지로 이동
3. 게시판 접근 시도 → 다시 로그인 페이지로 리다이렉트 ✅

---

## 🐛 문제 해결

### 문제 1: "Table 'spring_board.users' doesn't exist"
**해결:** DB 생성 및 테이블 생성 SQL 실행 확인

### 문제 2: "Cannot connect to database"
**해결:** 
- MariaDB 실행 확인
- `database.properties`의 비밀번호 확인
- DB 이름이 `spring_board`인지 확인

### 문제 3: "404 Not Found"
**해결:**
- Tomcat 실행 확인
- WAR 파일이 `webapps` 폴더에 있는지 확인
- URL이 `http://localhost:8080/spring-legacy-crud-1.0.0/` 인지 확인

### 문제 4: "500 Internal Server Error"
**해결:**
- Tomcat 로그 확인: `C:\Users\User\apache-tomcat-9.0.107\logs\catalina.out`
- DB 연결 확인
- MyBatis Mapper XML 파일 경로 확인

### 문제 5: Interceptor가 동작하지 않음
**해결:**
- `servlet-context.xml`에 Interceptor 등록 확인
- 경로 패턴이 올바른지 확인 (`/board/**`)

---

## 📝 테스트 체크리스트

### 기본 기능
- [ ] 메인 페이지 접근 가능
- [ ] 회원가입 성공
- [ ] 회원가입 중복 체크 동작
- [ ] 로그인 성공
- [ ] 로그인 실패 시 에러 메시지
- [ ] 로그아웃 동작

### Interceptor
- [ ] 로그인 없이 게시판 접근 시 로그인 페이지로 리다이렉트
- [ ] 로그인 후 게시판 접근 가능

### 게시판 CRUD
- [ ] 게시글 목록 조회
- [ ] 게시글 상세 보기
- [ ] 게시글 작성 (작성자 = 로그인 사용자)
- [ ] 게시글 수정 (작성자만 가능)
- [ ] 게시글 수정 (ADMIN도 가능)
- [ ] 게시글 삭제 (작성자만 가능)
- [ ] 게시글 삭제 (ADMIN도 가능)
- [ ] 권한 없는 수정/삭제 시도 시 에러 처리

---

## 🎯 빠른 테스트 명령어

### 전체 테스트 순서 (PowerShell)
```powershell
# 1. DB 설정 (MariaDB 접속 후)
mysql -u root -p < database_setup.sql

# 2. 빌드
cd "C:\Users\User\GitHub\WebCamp\web-camp-2026\week3"
mvn clean package

# 3. 배포
Copy-Item -Force .\target\spring-legacy-crud-1.0.0.war "C:\Users\User\apache-tomcat-9.0.107\webapps\"

# 4. Tomcat 실행
cd "C:\Users\User\apache-tomcat-9.0.107\bin"
.\startup.bat

# 5. 브라우저에서 접속
# http://localhost:8080/spring-legacy-crud-1.0.0/
```

---

## ✅ 성공 기준

모든 테스트 시나리오가 정상 동작하면 성공입니다!

특히 확인해야 할 핵심 기능:
1. ✅ Interceptor가 로그인하지 않은 사용자를 차단
2. ✅ 게시글 수정/삭제 권한이 작성자와 ADMIN에게만 허용
3. ✅ 세션 기반 로그인/로그아웃 정상 동작
