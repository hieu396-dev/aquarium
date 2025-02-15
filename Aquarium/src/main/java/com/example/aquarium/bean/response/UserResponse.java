package com.example.aquarium.bean.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Setter
public class UserResponse {
    private Integer id;
    private String firstName;
    private String lastName;
    private String email;
    private String address;
    private String phone;
    private String accountStatus;
    private RoleResponse role;
    private List<PermissionResponse> permissions;
}

