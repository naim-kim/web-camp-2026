package com.example.jdbc;

import java.io.FileInputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class DBUtil {

    private static final String PROPS_PATH = "config/db.properties";
    private static String url;
    private static String user;
    private static String password;

    static {
        Properties props = new Properties();
        try (FileInputStream fis = new FileInputStream(PROPS_PATH)) {
            props.load(fis);
            url = props.getProperty("DB_URL");
            user = props.getProperty("DB_USER");
            password = props.getProperty("DB_PASSWORD");
        } catch (IOException e) {
            System.out.println("Failed to read DB " + PROPS_PATH);
            e.printStackTrace();
        }
    }

    public static Connection getConnection() throws SQLException {
        if (url == null || user == null) {
            throw new SQLException("Falied to load DB");
        }
        return DriverManager.getConnection(url, user, password);
    }
}


