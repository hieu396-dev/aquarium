package com.example.aquarium.repository;

import com.example.aquarium.model.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    @EntityGraph(attributePaths = {"role", "role.permissions"})
    User findByEmail(String email);
    boolean existsByEmail(String email);
}

