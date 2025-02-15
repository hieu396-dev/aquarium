package com.example.aquarium.mapper;

import com.example.aquarium.bean.response.PermissionResponse;
import com.example.aquarium.bean.response.RoleResponse;
import com.example.aquarium.bean.response.UserResponse;
import com.example.aquarium.model.Role;
import com.example.aquarium.model.User;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class UserMapper {

    public static UserResponse toResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setAddress(user.getAddress());
        response.setPhone(user.getPhone());
        response.setAccountStatus(user.getAccountStatus());

        Role role = user.getRole();
        if (role != null) {
            RoleResponse roleResponse = new RoleResponse();
            roleResponse.setId(role.getId());
            roleResponse.setRoleName(role.getRoleName());
            response.setRole(roleResponse);
        }

        List<PermissionResponse> permissionResponses =
                (user.getRole() != null && user.getRole().getPermissions() != null)
                        ? user.getRole().getPermissions().stream()
                        .map(permission -> {
                            PermissionResponse permissionResponse = new PermissionResponse();
                            permissionResponse.setId(permission.getId());
                            permissionResponse.setPermissionName(permission.getPermissionName());
                            return permissionResponse;
                        })
                        .collect(Collectors.toList())
                        : Collections.emptyList();

        response.setPermissions(permissionResponses);

        return response;
    }
}

