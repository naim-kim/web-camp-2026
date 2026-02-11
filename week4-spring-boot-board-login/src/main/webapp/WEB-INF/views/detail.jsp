<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Item Detail</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/style.css">
</head>
<body>
    <div class="container">
        <h1>Item Detail</h1>
        
        <div class="detail-card">
            <div class="detail-row">
                <strong>ID:</strong> ${item.id}
            </div>
            <div class="detail-row">
                <strong>Title:</strong> ${item.title}
            </div>
            <div class="detail-row">
                <strong>Content:</strong>
                <p>${item.content}</p>
            </div>
            <div class="detail-row">
                <strong>Created At:</strong> 
                <fmt:formatDate value="${item.createdAt}" pattern="yyyy-MM-dd HH:mm:ss"/>
            </div>
            <div class="detail-row">
                <strong>Updated At:</strong> 
                <fmt:formatDate value="${item.updatedAt}" pattern="yyyy-MM-dd HH:mm:ss"/>
            </div>
        </div>
        
        <div class="actions">
            <a href="${pageContext.request.contextPath}/items" class="btn btn-secondary">Back to List</a>
            <a href="${pageContext.request.contextPath}/items/${item.id}/update" 
               class="btn btn-warning">Edit</a>
            <form action="${pageContext.request.contextPath}/items/${item.id}/delete" 
                  method="post" style="display:inline;">
                <button type="submit" class="btn btn-danger"
                        onclick="return confirm('Are you sure you want to delete this item?')">
                    Delete
                </button>
            </form>
        </div>
    </div>
</body>
</html>
