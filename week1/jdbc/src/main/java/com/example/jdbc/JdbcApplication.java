package com.example.jdbc;

import java.io.FileInputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Properties;

public class JdbcApplication {
    public static void main(String[] args) {

        Properties props = new Properties();

        try (FileInputStream fis = new FileInputStream("config/db.properties")) {
            props.load(fis);

            String url = props.getProperty("DB_URL");
            String user = props.getProperty("DB_USER");
            String password = props.getProperty("DB_PASSWORD");

            try (Connection conn = DriverManager.getConnection(url, user, password)) {
                System.out.println("DB Connection Test Successful!");
            }
        } catch (Exception e) {
            System.out.println("DB Connection Test Failed!!");
            e.printStackTrace();
        }
    }
}
