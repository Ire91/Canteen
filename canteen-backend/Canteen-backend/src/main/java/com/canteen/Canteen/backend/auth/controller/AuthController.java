package com.canteen.Canteen.backend.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.canteen.Canteen.backend.auth.dto.LoginResponse;
import com.canteen.Canteen.backend.auth.service.AuthService;
import com.canteen.Canteen.backend.dto.LoginRequest;
import com.canteen.Canteen.backend.dto.StaffDTO;
import com.canteen.Canteen.backend.model.Staff;
import com.canteen.Canteen.backend.repository.StaffRepository;
import com.canteen.Canteen.backend.security.jwt.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;
    @Autowired
    private StaffRepository staffRepository;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No token provided or invalid token format");
        }
        String token = authHeader.substring(7);
        String username = jwtUtil.extractUsername(token);
        Staff staff = staffRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(staff);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(@RequestBody StaffDTO updateRequest, HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No token provided or invalid token format");
        }
        String token = authHeader.substring(7);
        String username = jwtUtil.extractUsername(token);
        Staff staff = staffRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        // Only allow updating name and department
        if (updateRequest.getName() != null) staff.setName(updateRequest.getName());
        if (updateRequest.getDepartment() != null) staff.setDepartment(updateRequest.getDepartment());
        staffRepository.save(staff);
        return ResponseEntity.ok(StaffDTO.fromStaff(staff));
    }
} 