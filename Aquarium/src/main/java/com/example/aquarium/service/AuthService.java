package com.example.aquarium.service;


import com.example.aquarium.bean.request.AdminDTO;
import com.example.aquarium.bean.request.LoginRequest;
import com.example.aquarium.bean.request.PasswordChangeRequest;
import com.example.aquarium.bean.request.UserDTO;
import com.example.aquarium.bean.response.AuthResponse;
import com.example.aquarium.bean.response.MessageResponse;
import com.example.aquarium.exception.ResourceNotFoundException;
import com.example.aquarium.model.Role;
import com.example.aquarium.model.Status;
import com.example.aquarium.model.User;
import com.example.aquarium.repository.RoleRepository;
import com.example.aquarium.repository.UserRepository;
import com.example.aquarium.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    private final JwtTokenProvider jwtTokenProvider;

    private final PasswordEncoder passwordEncoder;

    private final EmailService emailService;

    public MessageResponse loginUser(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail());

        if (user == null) {
            return new MessageResponse("Invalid username", Map.of("email", "User not found"));
        }
        if ("inactive".equalsIgnoreCase(user.getAccountStatus())) {
            return new MessageResponse("Account inactive", Map.of("status", "User account is inactive. Please contact support."));
        }
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return new MessageResponse("Invalid password", Map.of("password", "Incorrect password"));
        }
        String targetRole = loginRequest.getTargetRole();
        if ("customer".equalsIgnoreCase(targetRole) && !targetRole.equalsIgnoreCase(user.getRole().getRoleName())) {
            System.out.println(user.getRole().getRoleName());
            return new MessageResponse("Access denied", Map.of("role", "User is not allowed to access customer area"));
        }
        if ("admin".equalsIgnoreCase(targetRole) && user.getRole().getRoleName().equalsIgnoreCase("customer")) {
            return new MessageResponse("Access denied", Map.of("role", "User is not allowed to access admin area"));
        }

        String token = jwtTokenProvider.generateToken(loginRequest.getEmail());
        return new MessageResponse("Login successful " + token, null);
    }


    public MessageResponse changePassword(Integer id, PasswordChangeRequest passwordChangeRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (!passwordEncoder.matches(passwordChangeRequest.getOldPassword(), user.getPassword())) {
            return new MessageResponse("Invalid password", Map.of("oldPassword", "Incorrect old password"));
        }

        String encodedPassword = passwordEncoder.encode(passwordChangeRequest.getNewPassword());
        user.setPassword(encodedPassword);
        userRepository.save(user);

        return new MessageResponse("Password changed successfully");
    }

    private final Map<String, String> verificationCodes = new HashMap<>();
    private final Map<String, UserDTO> pendingUsers = new HashMap<>();

    public MessageResponse registerUser(UserDTO userDto) {
        if (userRepository.existsByEmail(userDto.getEmail())) {

            return new MessageResponse("Email already registered", Map.of("email", "This email is already in use"));
        }

        try {
            String verificationCode = emailService.sendVerificationCode(userDto.getEmail());
            verificationCodes.put(userDto.getEmail(), verificationCode);
            pendingUsers.put(userDto.getEmail(), userDto);

            return new MessageResponse("Verification code sent to your email. Please verify to complete registration.");

        } catch (Exception e) {
            return new MessageResponse("An error occurred while sending the verification code. Please try again later.");
        }
    }

    public AuthResponse confirmRegistration(String email, String verificationCode) throws Exception {
        if (!verificationCodes.containsKey(email) || !verificationCodes.get(email).equals(verificationCode)) {
            throw new Exception("Invalid or expired verification code.");
        }

        verificationCodes.remove(email);
        UserDTO userDto = pendingUsers.remove(email);

        if (userDto == null) {
            throw new Exception("User data not found. Please register again.");
        }

        String encodedPassword = passwordEncoder.encode(userDto.getPassword());

        Optional<Role> optionalRole = Optional.ofNullable(roleRepository.findById(1));
        Role role = optionalRole.orElseThrow(() -> new Exception("Role not found"));

        User user = new User();
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());
        user.setPassword(encodedPassword);
        user.setAddress(userDto.getAddress());
        user.setPhone(userDto.getPhone());
        user.setAccountStatus(Status.ACTIVE.toString());
        user.setRole(role);

        userRepository.save(user);
        String token = jwtTokenProvider.generateToken(user.getEmail());

        return new AuthResponse(token);
    }
    public MessageResponse registerAdmin(AdminDTO adminDTO) {

        if (userRepository.existsByEmail(adminDTO.getEmail())) {
            return new MessageResponse("Email already registered", Map.of("email", "This email is already in use"));
        }
        try {
            String encodedPassword = passwordEncoder.encode(adminDTO.getPassword());
            Optional<Role> optionalRole = Optional.ofNullable(roleRepository.findById(adminDTO.getRoleId()));
            Role role = optionalRole.orElseThrow(() -> new Exception("Role not found"));
            User user = new User();
            user.setFirstName(adminDTO.getFirstName());
            user.setLastName(adminDTO.getLastName());
            user.setEmail(adminDTO.getEmail());
            user.setPassword(encodedPassword);
            user.setAddress(adminDTO.getAddress());
            user.setPhone(adminDTO.getPhone());
            user.setAccountStatus(Status.ACTIVE.toString());
            user.setRole(role);


            userRepository.save(user);
            String token = jwtTokenProvider.generateToken(user.getEmail());
            return new MessageResponse("Admin registered successfully");

        } catch (Exception e) {
            return new MessageResponse("An error occurred during registration. Please try again later.");
        }
    }

}







