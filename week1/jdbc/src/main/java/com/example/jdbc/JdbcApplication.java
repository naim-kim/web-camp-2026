package com.example.jdbc;

import java.util.List;
import java.util.Scanner;

public class JdbcApplication {

    private static final Scanner scanner = new Scanner(System.in);
    private static final TaskDao taskDao = new TaskDao();

    public static void main(String[] args) {

        while (true) {
            printMenu();
            int choice = readInt("Select a menu: ");

            switch (choice) {
                case 1:
                    addTask();
                    break;
                case 2:
                    listTasks();
                    break;
                case 3:
                    updateTaskMenu();
                    break;
                case 4:
                    deleteTask();
                    break;
                case 0:
                    System.out.println("Exiting the program.");
                    return;
                default:
                    System.out.println("Invalid menu option. Please try again.");
            }
        }
    }

    private static void printMenu() {
        System.out.println();
        System.out.println("===== Task Manager =====");
        System.out.println("1) Create");
        System.out.println("2) List");
        System.out.println("3) Update (edit title or toggle done)");
        System.out.println("4) Delete");
        System.out.println("0) Exit");
    }

    private static int readInt(String msg) {
        while (true) {
            System.out.print(msg);
            String line = scanner.nextLine();
            try {
                return Integer.parseInt(line);
            } catch (NumberFormatException e) {
                System.out.println("Please enter a valid number.");
            }
        }
    }

    private static void addTask() {
        System.out.print("Task title: ");
        String title = scanner.nextLine();

        Task task = new Task(title);
        taskDao.create(task);
    }

    private static void listTasks() {
        List<Task> tasks = taskDao.findAll();
        if (tasks.isEmpty()) {
            System.out.println("No tasks found.");
            return;
        }

        System.out.println("===== All Tasks =====");
        for (Task t : tasks) {
            System.out.println(t);
        }

        // Optional single task lookup
        System.out.print("Lookup by ID? (y/n): ");
        String answer = scanner.nextLine().trim().toLowerCase();
        if (answer.equals("y")) {
            int id = readInt("ID to lookup: ");
            Task t = taskDao.findById(id);
            if (t == null) {
                System.out.println("Task not found.");
            } else {
                System.out.println("===== Task =====");
                System.out.println(t);
            }
        }
    }

    private static void updateTaskMenu() {
        int id = readInt("Task ID to update: ");
        Task existing = taskDao.findById(id);
        if (existing == null) {
            System.out.println("Task not found.");
            return;
        }

        System.out.println("Selected task: " + existing);
        System.out.println("1) Edit title");
        System.out.println("2) Toggle done");
        int choice = readInt("Choose: ");

        switch (choice) {
            case 1:
                System.out.print("New title: ");
                String newTitle = scanner.nextLine();
                boolean updated = taskDao.updateTitle(id, newTitle);
                if (updated) {
                    System.out.println("Title updated.");
                } else {
                    System.out.println("Title update failed.");
                }
                break;
            case 2:
                boolean toggled = taskDao.toggleDone(id);
                if (toggled) {
                    System.out.println("Done status toggled.");
                } else {
                    System.out.println("Toggle failed.");
                }
                break;
            default:
                System.out.println("Invalid choice.");
        }
    }

    private static void deleteTask() {
        int id = readInt("Task ID to delete: ");
        Task existing = taskDao.findById(id);
        if (existing == null) {
            System.out.println("Task not found.");
            return;
        }

        System.out.println("Will delete: " + existing);
        System.out.print("Are you sure? (y/n): ");
        String answer = scanner.nextLine().trim().toLowerCase();
        if (!answer.equals("y")) {
            System.out.println("Delete cancelled.");
            return;
        }

        boolean deleted = taskDao.delete(id);
        if (deleted) {
            System.out.println("Deleted.");
        } else {
            System.out.println("Delete failed.");
        }
    }
}