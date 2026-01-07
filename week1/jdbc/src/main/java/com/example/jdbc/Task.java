package com.example.jdbc;

import java.sql.Timestamp;

public class Task {
    private int id;
    private String title;
    private boolean done;
    private Timestamp createdAt;

    public Task(int id, String title, boolean done, Timestamp createdAt) {
        this.id = id;
        this.title = title;
        this.done = done;
        this.createdAt = createdAt;
    }

    public Task(String title) {
        this.title = title;
        this.done = false;
    }

    public int getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public boolean isDone() {
        return done;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDone(boolean done) {
        this.done = done;
    }

    @Override
    public String toString() {
        return String.format(
                "ID: %d | Title: %s | Done: %s | Created: %s",
                id, title, done ? "Y" : "N", createdAt);
    }
}
