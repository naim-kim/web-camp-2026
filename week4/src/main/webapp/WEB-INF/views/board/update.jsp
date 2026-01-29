<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>게시글 수정</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/style.css">
</head>
<body>
    <div class="container">
        <h1>게시글 수정</h1>
        
        <c:if test="${not empty error}">
            <div style="color: red; margin-bottom: 15px; padding: 10px; background: #ffe6e6; border-radius: 4px;">
                ${error}
            </div>
        </c:if>
        
        <form method="post" action="${pageContext.request.contextPath}/board/${board.id}/update">
            <div style="margin-bottom: 15px;">
                <label for="title" style="display: block; margin-bottom: 5px; font-weight: bold;">제목</label>
                <input type="text" id="title" name="title" value="${board.title}" required 
                       style="width: 100%; padding: 8px; box-sizing: border-box;">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label for="content" style="display: block; margin-bottom: 5px; font-weight: bold;">내용</label>
                <textarea id="content" name="content" required 
                          style="width: 100%; min-height: 300px; padding: 8px; box-sizing: border-box;">${board.content}</textarea>
            </div>
            
            <div>
                <button type="submit" class="btn btn-primary">수정</button>
                <a href="${pageContext.request.contextPath}/board/${board.id}" class="btn">취소</a>
            </div>
        </form>
    </div>
</body>
</html>
