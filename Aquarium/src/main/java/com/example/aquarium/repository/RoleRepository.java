package com.example.aquarium.repository;

import com.example.aquarium.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Role findById(int id);
    boolean existsByRoleName(String roleName);
}
