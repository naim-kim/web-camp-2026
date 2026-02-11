<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>게시글 상세</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/style.css">
    <style>
        .board-detail {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
        }
        .board-header {
            border-bottom: 2px solid #ddd;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .board-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .board-meta {
            color: #666;
            font-size: 14px;
        }
        .board-content {
            min-height: 300px;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-bottom: 20px;
            white-space: pre-wrap;
        }
        .board-actions {
            text-align: right;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="board-detail">
            <div class="board-header">
                <div class="board-title">${board.title}</div>
                <div class="board-meta">
                    작성자: ${board.writer} | 
                    작성일: <fmt:formatDate value="${board.createdAt}" pattern="yyyy-MM-dd HH:mm"/>
                    <c:if test="${board.updatedAt != null && board.updatedAt != board.createdAt}">
                        | 수정일: <fmt:formatDate value="${board.updatedAt}" pattern="yyyy-MM-dd HH:mm"/>
                    </c:if>
                </div>
            </div>
            
            <div class="board-content">${board.content}</div>
            
            <div class="board-actions">
                <c:if test="${canEdit}">
                    <a href="${pageContext.request.contextPath}/board/${board.id}/update" 
                       class="btn btn-warning">수정</a>
                    <form action="${pageContext.request.contextPath}/board/${board.id}/delete" 
                          method="post" style="display:inline;">
                        <button type="submit" class="btn btn-danger"
                                onclick="return confirm('정말 삭제하시겠습니까?')">삭제</button>
                    </form>
                </c:if>
                <a href="${pageContext.request.contextPath}/board/list" class="btn">목록</a>
            </div>
        </div>
    </div>
</body>
</html>
