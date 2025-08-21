// TODO: Refactor to modular monolith structure. This model will be moved to a feature-based package (e.g., user.model) as part of the restructuring.
package com.canteen.Canteen.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "staff")
public class Staff {

    @Id
    @Column(name = "username", nullable = false, length = 50)
    private String username;
    


    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 20)
    private String role; // e.g., ADMIN, USER

    @Column(length = 100)
    private String department;
    
    @Column(name = "staff_id", nullable = false, unique = true, length = 20)
    private String staffId;

    // Constructors
    public Staff() {
    }

    public Staff(String username, String password, String name, String role, String department, String staffId) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.role = role;
        this.department = department;
        this.staffId = staffId;
    }

    // Getters
    public String getUsername() {
        return this.username;
    }

    public String getPassword() {
        return this.password;
    }

    public String getName() {
        return this.name;
    }

    public String getRole() {
        return this.role;
    }

    public String getDepartment() {
        return this.department;
    }

    public String getStaffId() {
        return this.staffId;
    }

    // Setters
    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public void setStaffId(String staffId) {
        this.staffId = staffId;
    }

    // Builder pattern
    public static StaffBuilder builder() {
        return new StaffBuilder();
    }

    public static class StaffBuilder {
        private String username;
        private String password;
        private String name;
        private String role;
        private String department;
        private String staffId;

        public StaffBuilder username(String username) {
            this.username = username;
            return this;
        }

        public StaffBuilder password(String password) {
            this.password = password;
            return this;
        }

        public StaffBuilder name(String name) {
            this.name = name;
            return this;
        }

        public StaffBuilder role(String role) {
            this.role = role;
            return this;
        }

        public StaffBuilder department(String department) {
            this.department = department;
            return this;
        }

        public StaffBuilder staffId(String staffId) {
            this.staffId = staffId;
            return this;
        }

        public Staff build() {
            return new Staff(username, password, name, role, department, staffId);
        }
    }

    public static void main(String[] args) {
        // Test the builder and getters
        Staff testStaff = Staff.builder()
            .username("testuser")
            .password("testpass")
            .name("Test User")
            .role("USER")
            .staffId("EMP123")
            .build();
        
        System.out.println("Test Staff:");
        System.out.println("Username: " + testStaff.getUsername());
        System.out.println("Name: " + testStaff.getName());
        System.out.println("Role: " + testStaff.getRole());
    }
}
