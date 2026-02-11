<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>게시글 작성</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/style.css">
</head>
<body>
    <div class="container">
        <h1>게시글 작성</h1>
        
        <form method="post" action="${pageContext.request.contextPath}/board/create">
            <div style="margin-bottom: 15px;">
                <label for="title" style="display: block; margin-bottom: 5px; font-weight: bold;">제목</label>
                <input type="text" id="title" name="title" required 
                       style="width: 100%; padding: 8px; box-sizing: border-box;"
                       placeholder="제목을 입력하세요">
            </div>
            
            <div style="margin-bottom: 15px;">
                <label for="content" style="display: block; margin-bottom: 5px; font-weight: bold;">내용</label>
                <textarea id="content" name="content" required 
                          style="width: 100%; min-height: 300px; padding: 8px; box-sizing: border-box;"
                          placeholder="내용을 입력하세요"></textarea>
            </div>
            
            <div>
                <button type="submit" class="btn btn-primary">작성</button>
                <a href="${pageContext.request.contextPath}/board/list" class="btn">취소</a>
            </div>
        </form>
    </div>
</body>
</html>
