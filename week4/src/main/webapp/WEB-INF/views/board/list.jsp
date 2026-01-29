<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>게시판 목록</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/style.css">
</head>
<body>
    <div class="container">
        <h1>게시판</h1>
        
        <c:if test="${not empty username}">
            <p style="text-align: right;">
                <strong>${username}</strong>님 (${role})
                <a href="${pageContext.request.contextPath}/logout" style="margin-left: 10px;">로그아웃</a>
            </p>
        </c:if>
        
        <div style="margin-bottom: 20px;">
            <a href="${pageContext.request.contextPath}/board/create" class="btn btn-primary">
                새 글 작성
            </a>
            <a href="${pageContext.request.contextPath}/" class="btn" style="margin-left: 10px;">메인으로</a>
        </div>
        
        <table class="table">
            <thead>
                <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                </tr>
            </thead>
            <tbody>
                <c:forEach var="board" items="${boards}">
                    <tr>
                        <td>${board.id}</td>
                        <td>
                            <a href="${pageContext.request.contextPath}/board/${board.id}">
                                ${board.title}
                            </a>
                        </td>
                        <td>${board.writer}</td>
                        <td>
                            <fmt:formatDate value="${board.createdAt}" pattern="yyyy-MM-dd HH:mm"/>
                        </td>
                    </tr>
                </c:forEach>
            </tbody>
        </table>
    </div>
</body>
</html>
