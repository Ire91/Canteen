package com.canteen.Canteen.backend.auth.dto;

public class LoginResponse {
    private String username;
    private String name;
    private String role;
    private String department;
    private String staffId;
    private String token;

    public LoginResponse(String username, String name, String role, String department, String staffId, String token) {
        this.username = username;
        this.name = name;
        this.role = role;
        this.department = department;
        this.staffId = staffId;
        this.token = token;
    }

    // Getters and setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getStaffId() { return staffId; }
    public void setStaffId(String staffId) { this.staffId = staffId; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
} 