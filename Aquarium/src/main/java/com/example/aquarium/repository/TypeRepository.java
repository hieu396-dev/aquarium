package com.example.aquarium.repository;

import com.example.aquarium.model.Type;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface TypeRepository extends JpaRepository<Type, Integer> {
    boolean existsByTypeName(String typeName);
}

