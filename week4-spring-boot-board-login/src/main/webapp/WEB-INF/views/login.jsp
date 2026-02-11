<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>로그인</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/style.css">
    <style>
        .login-container {
            max-width: 400px;
            margin: 100px auto;
            padding: 30px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background: white;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        .form-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        .btn-login {
            width: 100%;
            padding: 12px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        .btn-login:hover {
            background: #0056b3;
        }
        .error-message {
            color: red;
            margin-bottom: 15px;
            padding: 10px;
            background: #ffe6e6;
            border-radius: 4px;
        }
        .register-link {
            text-align: center;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <h1>로그인</h1>
        
        <c:if test="${not empty error}">
            <div class="error-message">${error}</div>
        </c:if>
        
        <form method="post" action="${pageContext.request.contextPath}/login">
            <!-- redirectURL이 있으면 hidden field로 전달 -->
            <c:if test="${not empty redirectURL}">
                <input type="hidden" name="redirectURL" value="${redirectURL}">
            </c:if>
            
            <div class="form-group">
                <label for="username">아이디</label>
                <input type="text" id="username" name="username" required>
            </div>
            
            <div class="form-group">
                <label for="password">비밀번호</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <button type="submit" class="btn-login">로그인</button>
        </form>
        
        <div class="register-link">
            <a href="${pageContext.request.contextPath}/register">회원가입</a>
        </div>
        <div style="text-align: center; margin-top: 10px;">
            <a href="${pageContext.request.contextPath}/">메인으로</a>
        </div>
    </div>
</body>
</html>
