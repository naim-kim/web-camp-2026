<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Create Item</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/style.css">
</head>
<body>
    <div class="container">
        <h1>Create New Item</h1>
        
        <form action="${pageContext.request.contextPath}/items/create" method="post" class="form">
            <div class="form-group">
                <label for="title">Title:</label>
                <input type="text" id="title" name="title" class="form-control" required>
            </div>
            
            <div class="form-group">
                <label for="content">Content:</label>
                <textarea id="content" name="content" class="form-control" rows="5"></textarea>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Create</button>
                <a href="${pageContext.request.contextPath}/items" class="btn btn-secondary">Cancel</a>
            </div>
        </form>
    </div>
</body>
</html>
