// TODO: Refactor to modular monolith structure. This DTO will be moved to a feature-based package (e.g., user.dto) as part of the restructuring.
package com.canteen.Canteen.backend.dto;

public class StaffDTO {
    private String username;
    private String name;
    private String role;
    private String department;
    private String staffId;

    // No-args constructor for JPA/Hibernate and JSON deserialization
    public StaffDTO() {
    }

    // Explicit constructor
    public StaffDTO(String username, String name, String role, String department, String staffId) {
        this.username = username;
        this.name = name;
        this.role = role;
        this.department = department;
        this.staffId = staffId;
    }

    // Explicit getters
    public String getUsername() {
        return username;
    }

    public String getName() {
        return name;
    }

    public String getRole() {
        return role;
    }

    public String getDepartment() {
        return department;
    }

    public String getStaffId() {
        return staffId;
    }

    // Convert from Staff entity to StaffDTO
    public static StaffDTO fromStaff(com.canteen.Canteen.backend.model.Staff staff) {
        if (staff == null) {
            return null;
        }
        return new StaffDTO(
            staff.getUsername(),
            staff.getName(),
            staff.getRole(),
            staff.getDepartment(),
            staff.getStaffId()
        );
    }
}
