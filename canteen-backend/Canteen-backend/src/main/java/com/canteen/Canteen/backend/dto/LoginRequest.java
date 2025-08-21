// TODO: Refactor to modular monolith structure. This DTO will be moved to a feature-based package (e.g., auth.dto) as part of the restructuring.
package com.canteen.Canteen.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotBlank
    private String username;
    
    @NotBlank
    private String password;
    
    // Explicit getters to ensure they're available at compile time
    public String getUsername() {
        return username;
    }
    
    public String getPassword() {
        return password;
    }
}
