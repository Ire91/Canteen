package com.canteen.Canteen.backend;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import static org.junit.jupiter.api.Assertions.*;

public class PasswordTest {
    
    @Test
    public void testPasswordHashing() {
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "admin123";
        String storedHash = "{bcrypt}$2a$10$1UJmq9hw3rroWAtxEvsC0.7Ouk..qS0bkkCm1cW0XkyKADVY6jwxu";
        
        // Remove the {bcrypt} prefix if present
        String hashWithoutPrefix = storedHash.replace("{bcrypt}", "");
        
        // Test if the password matches the stored hash
        boolean matches = encoder.matches(rawPassword, hashWithoutPrefix);
        System.out.println("Password matches: " + matches);
        
        // If it doesn't match, generate a new hash for the password
        if (!matches) {
            String newHash = encoder.encode(rawPassword);
            System.out.println("New hash for 'admin123': " + newHash);
        }
    }
}
