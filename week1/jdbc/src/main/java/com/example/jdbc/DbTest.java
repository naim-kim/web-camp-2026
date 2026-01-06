package com.example.jdbc;

import java.io.FileInputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Properties;

public class DbTest {
    public static void main(String[] args) {
        Properties props = new Properties();

        try (FileInputStream fis = new FileInputStream("config/db.properties")) {
            props.load(fis);

            String url = props.getProperty("DB_URL");
            String user = props.getProperty("DB_USER");
            String password = props.getProperty("DB_PASSWORD");

            try (Connection conn = DriverManager.getConnection(url, user, password)) {
                System.out.println("✅ DB 접속 성공!");
            }
        } catch (Exception e) {
            System.out.println("❌ DB 접속 실패!");
            e.printStackTrace();
        }
    }
}
