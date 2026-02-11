<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Item List</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/resources/css/style.css">
</head>
<body>
    <div class="container">
        <h1>Item List</h1>
        
        <a href="${pageContext.request.contextPath}/items/create" class="btn btn-primary">
            Create New Item
        </a>
        
        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Created At</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <c:forEach var="item" items="${items}">
                    <tr>
                        <td>${item.id}</td>
                        <td>
                            <a href="${pageContext.request.contextPath}/items/${item.id}">
                                ${item.title}
                            </a>
                        </td>
                        <td>
                            <fmt:formatDate value="${item.createdAt}" pattern="yyyy-MM-dd HH:mm"/>
                        </td>
                        <td>
                            <a href="${pageContext.request.contextPath}/items/${item.id}/update" 
                               class="btn btn-sm btn-warning">Edit</a>
                            <form action="${pageContext.request.contextPath}/items/${item.id}/delete" 
                                  method="post" style="display:inline;">
                                <button type="submit" class="btn btn-sm btn-danger"
                                        onclick="return confirm('Are you sure?')">Delete</button>
                            </form>
                        </td>
                    </tr>
                </c:forEach>
            </tbody>
        </table>
    </div>
</body>
</html>
