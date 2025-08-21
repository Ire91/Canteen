// TODO: Refactor to modular monolith structure. This service will be moved to a feature-based package (e.g., auth.service) as part of the restructuring.
package com.canteen.Canteen.backend.service;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.canteen.Canteen.backend.model.Staff;
import com.canteen.Canteen.backend.repository.StaffRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final StaffRepository staffRepository;
    private final PasswordEncoder passwordEncoder;
    
    private String maskPassword(String password) {
        if (password == null || password.length() < 3) {
            return "[too short to mask]";
        }
        return password.substring(0, 3) + "..." + (password.length() > 6 ? 
               password.substring(password.length() - 3) : "");
    }

    public CustomUserDetailsService(StaffRepository staffRepository, PasswordEncoder passwordEncoder) {
        this.staffRepository = staffRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("\n===== CustomUserDetailsService.loadUserByUsername() called =====");
        System.out.println("Looking up username: " + username);
        
        try {
            Staff staff = staffRepository.findByUsername(username)
                    .orElseThrow(() -> {
                        System.err.println("❌ User not found in database: " + username);
                        return new UsernameNotFoundException("User not found: " + username);
                    });
            
            System.out.println("✅ Found user: " + staff.getUsername());
            System.out.println("   Role: " + staff.getRole());
            System.out.println("   Password hash: " + maskPassword(staff.getPassword()));
            
            // Get the password as stored in the database (with {bcrypt} prefix)
            String password = staff.getPassword();
            if (password == null) {
                System.err.println("❌ User has no password set: " + staff.getUsername());
                throw new UsernameNotFoundException("User has no password set");
            }
            
            // Log the password hash (masked for security)
            System.out.println("   Password hash: " + maskPassword(password));
            
            // Validate role
            if (staff.getRole() == null || staff.getRole().trim().isEmpty()) {
                System.err.println("❌ User has no role assigned: " + staff.getUsername());
                throw new UsernameNotFoundException("User has no role assigned");
            }
            
            // Remove the {bcrypt} prefix if present for Spring Security
            String passwordToUse = password;
            if (passwordToUse.startsWith("{bcrypt}")) {
                passwordToUse = passwordToUse.substring(8); // Remove "{bcrypt}" prefix
                System.out.println("   Using password without {bcrypt} prefix");
            }
            
            // Create and return the UserDetails object
            UserDetails userDetails = User.withUsername(staff.getUsername())
                    .password(passwordToUse)
                    .roles(staff.getRole().toUpperCase())
                    .build();
                    
            System.out.println("✅ Successfully created UserDetails for: " + userDetails.getUsername());
            System.out.println("   Authorities: " + userDetails.getAuthorities());
            System.out.println("================================================\n");
            
            return userDetails;
            
        } catch (Exception e) {
            System.err.println("❌ Error in loadUserByUsername for user " + username + ": " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
