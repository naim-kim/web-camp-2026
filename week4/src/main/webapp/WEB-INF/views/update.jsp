<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Update Item</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/style.css">
</head>
<body>
    <div class="container">
        <h1>Update Item</h1>
        
        <form action="${pageContext.request.contextPath}/items/${item.id}/update" 
              method="post" class="form">
            <div class="form-group">
                <label for="title">Title:</label>
                <input type="text" id="title" name="title" class="form-control" 
                       value="${item.title}" required>
            </div>
            
            <div class="form-group">
                <label for="content">Content:</label>
                <textarea id="content" name="content" class="form-control" rows="5">${item.content}</textarea>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Update</button>
                <a href="${pageContext.request.contextPath}/items/${item.id}" 
                   class="btn btn-secondary">Cancel</a>
            </div>
        </form>
    </div>
</body>
</html>
