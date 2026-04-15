package com.survey.service;

import com.survey.dto.AuthResponse;
import com.survey.dto.LoginRequest;
import com.survey.dto.RegisterRequest;
import com.survey.entity.Admin;
import com.survey.entity.Admin.Role;
import com.survey.repository.AdminRepository;
import com.survey.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (adminRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }

        // Initialize using Builder (as per your Admin entity's annotations)
        Admin admin = Admin.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : Role.USER) // Default to USER if null
                .build();

        adminRepository.save(admin);
        String token = jwtService.generateToken(admin);

        return AuthResponse.builder()
                .token(token)
                .email(admin.getEmail())
                .fullName(admin.getFullName())
                .adminId(admin.getId())
                .role(admin.getRole().name()) // Let frontend know the role
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        Admin admin = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(admin);

        return AuthResponse.builder()
                .token(token)
                .email(admin.getEmail())
                .fullName(admin.getFullName())
                .adminId(admin.getId())
                .role(admin.getRole().name()) // Let frontend know the role
                .build();
    }
}
