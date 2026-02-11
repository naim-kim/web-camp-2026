package com.example.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class TaskDao {

    public void create(Task task) {
        String sql = "INSERT INTO tasks (title, done) VALUES (?, ?)";

        try (Connection conn = DBUtil.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, task.getTitle());
            pstmt.setBoolean(2, task.isDone());
            pstmt.executeUpdate();
            System.out.println("Task added.");

        } catch (SQLException e) {
            System.out.println("Error while adding task: " + e.getMessage());
        }
    }

    public List<Task> findAll() {
        List<Task> list = new ArrayList<>();
        String sql = "SELECT id, title, done, created_at FROM tasks ORDER BY id";

        try (Connection conn = DBUtil.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql);
                ResultSet rs = pstmt.executeQuery()) {

            while (rs.next()) {
                Task t = new Task(
                        rs.getInt("id"),
                        rs.getString("title"),
                        rs.getBoolean("done"),
                        rs.getTimestamp("created_at"));
                list.add(t);
            }

        } catch (SQLException e) {
            System.out.println("Error while reading tasks: " + e.getMessage());
        }

        return list;
    }

    public Task findById(int id) {
        String sql = "SELECT id, title, done, created_at FROM tasks WHERE id = ?";

        try (Connection conn = DBUtil.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, id);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return new Task(
                            rs.getInt("id"),
                            rs.getString("title"),
                            rs.getBoolean("done"),
                            rs.getTimestamp("created_at"));
                }
            }

        } catch (SQLException e) {
            System.out.println("Error while finding task: " + e.getMessage());
        }
        return null;
    }

    public boolean updateTitle(int id, String newTitle) {
        String sql = "UPDATE tasks SET title = ? WHERE id = ?";

        try (Connection conn = DBUtil.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, newTitle);
            pstmt.setInt(2, id);
            int affected = pstmt.executeUpdate();

            return affected > 0;

        } catch (SQLException e) {
            System.out.println("Error while updating title: " + e.getMessage());
            return false;
        }
    }

    public boolean toggleDone(int id) {
        // MariaDB에서 done(0/1)을 토글
        String sql = "UPDATE tasks SET done = CASE WHEN done = 1 THEN 0 ELSE 1 END WHERE id = ?";

        try (Connection conn = DBUtil.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, id);
            int affected = pstmt.executeUpdate();

            return affected > 0;

        } catch (SQLException e) {
            System.out.println("Error while toggling done: " + e.getMessage());
            return false;
        }
    }

    public boolean delete(int id) {
        String sql = "DELETE FROM tasks WHERE id = ?";

        try (Connection conn = DBUtil.getConnection();
                PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setInt(1, id);
            int affected = pstmt.executeUpdate();

            return affected > 0;

        } catch (SQLException e) {
            System.out.println("Error while deleting task: " + e.getMessage());
            return false;
        }
    }
}
