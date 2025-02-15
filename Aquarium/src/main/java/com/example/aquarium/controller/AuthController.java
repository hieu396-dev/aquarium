package com.example.aquarium.controller;

import com.example.aquarium.bean.request.AdminDTO;
import com.example.aquarium.bean.request.LoginRequest;
import com.example.aquarium.bean.request.UserDTO;
import com.example.aquarium.bean.response.AuthResponse;
import com.example.aquarium.bean.response.MessageResponse;
import com.example.aquarium.security.interfaceRole.AdminAccess;
import com.example.aquarium.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            MessageResponse response = authService.loginUser(loginRequest);
            if (response.getErrors() != null) {
                return ResponseEntity.badRequest().body(response);
            }
            String[] parts = response.getMessage().split(" ", 3);
            String token = parts[2];
            AuthResponse authResponse = new AuthResponse(token);
            return ResponseEntity.ok(authResponse);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new MessageResponse("An error occurred during login"));
        }


    }
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserDTO userDto) {
        try {
            MessageResponse response = authService.registerUser(userDto);
            if (response.getErrors() != null) {
                return ResponseEntity.badRequest().body(response);
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/confirm-registration")
    public ResponseEntity<?> confirmRegistration(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        String code = requestBody.get("code");

        if (email == null || code == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Email and code are required"));
        }
        try {
            AuthResponse response = authService.confirmRegistration(email, code);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @AdminAccess
    @PostMapping("/register-admin")
    public ResponseEntity<?> registerAdmin(@Valid @RequestBody AdminDTO adminDTO) {
        try {
            MessageResponse response = authService.registerAdmin(adminDTO);
            if (response.getErrors() != null) {
                return ResponseEntity.badRequest().body(response);
            }
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("An error occurred during registration. Please try again later."));
        }
    }

}



