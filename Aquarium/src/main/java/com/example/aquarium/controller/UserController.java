package com.example.aquarium.controller;

import com.example.aquarium.bean.request.PasswordChangeRequest;
import com.example.aquarium.bean.request.UserRequest;
import com.example.aquarium.bean.response.*;
import com.example.aquarium.bean.response.BuyResponse;
import com.example.aquarium.model.LoyaltyPoints;
import com.example.aquarium.model.Role;
import com.example.aquarium.model.User;
import com.example.aquarium.security.interfaceRole.AdminAccess;
import com.example.aquarium.security.interfaceRole.AdminAndInvoiceAccess;
import com.example.aquarium.security.interfaceRole.AdminInvoiceContentAccess;
import com.example.aquarium.security.jwt.JwtTokenProvider;
import com.example.aquarium.service.AuthService;
import com.example.aquarium.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final AuthService authService;

    @GetMapping("/info")
    public ResponseEntity<UserInfo> getUserInfo(@RequestHeader("Authorization") String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            String email = jwtTokenProvider.extractEmail(token);
            User user = userService.findByEmail(email);
            Role role = userService.findRoleByUserId(user.getRole().getId());
            LoyaltyPoints loyaltyPoints = userService.findLoyaltyPointsByUserId(user.getId());
            return ResponseEntity.ok(new UserInfo(
                    user.getId(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getAddress(),
                    user.getPhone(),
                    user.getAccountStatus(),
                    role.getRoleName(),
                    loyaltyPoints != null ? loyaltyPoints.getPoints() : 0,
                    loyaltyPoints != null ? loyaltyPoints.getLoyaltyPointValue().doubleValue() : 0.0,
                    loyaltyPoints != null ? loyaltyPoints.getCreatedAt() : new Date()
            ));
        } else {
            return ResponseEntity.badRequest().body(null);
        }
    }
    @GetMapping("/checkToken")
    public ResponseEntity<String> checkToken(@RequestParam String token) {
        if (token == null || token.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Token is missing or empty");
        }
        if (jwtTokenProvider.validateToken(token)) {
            return ResponseEntity.ok("Token is valid");
        } else {
            return ResponseEntity.badRequest().body("Invalid token");
        }
    }
    @AdminInvoiceContentAccess
    @GetMapping("/managers")
    public List<UserResponse> getAllManagers() {
        return userService.getUsersByRole("NotCustomer");
    }
    @AdminInvoiceContentAccess
    @GetMapping("/customers")
    public List<UserResponse> getAllCustomers() {
        return userService.getUsersByRole("CUSTOMER");
    }
    @PostMapping("update/{id}")
    public ResponseEntity<?> updateInfo(@PathVariable Integer id,@Valid @RequestBody UserRequest request){
        try {
            MessageResponse response = userService.updateUser(id, request);
            if (response.getErrors() != null) {
                return ResponseEntity.badRequest().body(response);
            }
            return ResponseEntity.ok("");
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    @PostMapping("/changePassword/{id}")
    public ResponseEntity<?> changePassword(
            @PathVariable Integer id,
            @Valid @RequestBody PasswordChangeRequest passwordChangeRequest) {
        try {
            MessageResponse response = authService.changePassword(id, passwordChangeRequest);
            if (response.getErrors() != null) {
                return ResponseEntity.badRequest().body(response);
            }
            return ResponseEntity.ok("");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    @GetMapping("/buy/{id}")
    public ResponseEntity<?> getBuyUser(@PathVariable Integer id){
        List<BuyResponse> buyResponses = userService.getBuyResponsesByUserId(id);
        return ResponseEntity.ok(buyResponses);
    }
    @AdminAndInvoiceAccess
    @GetMapping("/order/{id}")
    public ResponseEntity<?> getOrderUser(@PathVariable Integer id){
        List<OrderResponse> orderResponses = userService.getOrderResponseByUserId(id);
        return ResponseEntity.ok(orderResponses);
    }
    @AdminAccess
    @PutMapping("/update-status/{id}")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable Integer id,
            @RequestParam String status) {
        try {
            userService.updateUserStatus(id, status);
            return ResponseEntity.ok("");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status value");
        }
    }

}


