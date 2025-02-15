package com.example.aquarium.service;

import com.example.aquarium.bean.request.RoleRequest;
import com.example.aquarium.bean.response.PermissionResponse;
import com.example.aquarium.bean.response.RoleResponse;
import com.example.aquarium.exception.UniqueConstraintViolationException;
import com.example.aquarium.model.Permission;
import com.example.aquarium.model.Role;
import com.example.aquarium.repository.PermissionRepository;
import com.example.aquarium.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService {
    private final RoleRepository roleRepository;

    private final PermissionRepository permissionRepository;

    public RoleResponse createRole(RoleRequest request) {
        if (roleRepository.existsByRoleName(request.getRoleName())) {
            throw new UniqueConstraintViolationException("Role name '" + request.getRoleName() + "' already exists.");
        }
        Role role = new Role();
        role.setRoleName(request.getRoleName());

        if (request.getPermissionIds() != null) {
            for (Integer permissionId : request.getPermissionIds()) {
                Optional<Permission> permission = permissionRepository.findById(permissionId);
                permission.ifPresent(role::addPermission);
            }
        }

        roleRepository.save(role);
        return mapToResponse(role);
    }

    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public RoleResponse updateRole(int id, RoleRequest request) {
        if (roleRepository.existsByRoleName(request.getRoleName())) {
            throw new UniqueConstraintViolationException("Role name '" + request.getRoleName() + "' already exists.");
        }
        Role role = roleRepository.findById(id);
        role.setRoleName(request.getRoleName());

        role.getPermissions().clear();

        if (request.getPermissionIds() != null) {
            for (Integer permissionId : request.getPermissionIds()) {
                Optional<Permission> permission = permissionRepository.findById(permissionId);
                permission.ifPresent(role::addPermission);
            }
        }

        roleRepository.save(role);
        return mapToResponse(role);
    }


    private RoleResponse mapToResponse(Role role) {
        RoleResponse response = new RoleResponse();
        response.setId(role.getId());
        response.setRoleName(role.getRoleName());
        response.setPermissionResponses(convertToPermissionResponses(role.getPermissions()));
        return response;
    }
    public Set<PermissionResponse> convertToPermissionResponses(Set<Permission> permissions) {
        return permissions.stream()
                .map(permission -> new PermissionResponse(permission.getId(), permission.getPermissionName()))
                .collect(Collectors.toSet());
    }
}

