<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>메인 페이지</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/style.css">
    <style>
        .main-container {
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            text-align: center;
        }
        .welcome-box {
            background: #f5f5f5;
            padding: 30px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .menu-links {
            display: flex;
            gap: 20px;
            justify-content: center;
            margin-top: 30px;
        }
        .menu-links a {
            padding: 12px 24px;
            background: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            display: inline-block;
        }
        .menu-links a:hover {
            background: #0056b3;
        }
    </style>
</head>
<body>
    <div class="main-container">
        <h1>Spring MVC 게시판</h1>
        
        <div class="welcome-box">
            <c:choose>
                <c:when test="${not empty username}">
                    <h2>${username}님 환영합니다!</h2>
                    <p>역할: <strong>${role}</strong></p>
                    <div class="menu-links">
                        <a href="${pageContext.request.contextPath}/board/list">게시판</a>
                        <a href="${pageContext.request.contextPath}/logout">로그아웃</a>
                    </div>
                </c:when>
                <c:otherwise>
                    <h2>게시판에 오신 것을 환영합니다</h2>
                    <p>로그인 후 게시판을 이용하실 수 있습니다.</p>
                    <div class="menu-links">
                        <a href="${pageContext.request.contextPath}/login">로그인</a>
                        <a href="${pageContext.request.contextPath}/register">회원가입</a>
                    </div>
                </c:otherwise>
            </c:choose>
        </div>
    </div>
</body>
</html>
