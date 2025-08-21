package com.canteen.Canteen.backend.auth.service;

import com.canteen.Canteen.backend.auth.dto.LoginResponse;
import com.canteen.Canteen.backend.dto.LoginRequest;
import com.canteen.Canteen.backend.model.Staff;
import com.canteen.Canteen.backend.repository.StaffRepository;
import com.canteen.Canteen.backend.security.jwt.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private StaffRepository staffRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        Staff staff = staffRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));
        if (!passwordEncoder.matches(request.getPassword(), staff.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }
        String token = jwtUtil.generateToken(staff.getUsername());
        return new LoginResponse(
                staff.getUsername(),
                staff.getName(),
                staff.getRole(),
                staff.getDepartment(),
                staff.getStaffId(),
                token
        );
    }
} 