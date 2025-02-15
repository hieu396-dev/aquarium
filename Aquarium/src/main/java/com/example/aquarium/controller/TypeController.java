package com.example.aquarium.controller;

import com.example.aquarium.bean.request.TypeRequest;
import com.example.aquarium.bean.response.TypeResponse;
import com.example.aquarium.security.interfaceRole.*;
import com.example.aquarium.service.TypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/types")
@RequiredArgsConstructor
public class TypeController {

    private final TypeService typeService;

    @AdminAndContentStaffAccess
    @PostMapping
    public ResponseEntity<TypeResponse> createType(@Valid @RequestBody TypeRequest request) {
        TypeResponse response = typeService.createType(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    @GetMapping("/{id}")
    public ResponseEntity<TypeResponse> getType(@PathVariable Integer id) {
        return typeService.getType(id)
                .map(type -> new ResponseEntity<>(type, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    @GetMapping
    public ResponseEntity<List<TypeResponse>> getAllTypes() {
        List<TypeResponse> responses = typeService.getAllTypes();
        return ResponseEntity.ok(responses);
    }
    @AdminContentCustomerAccess
    @PutMapping("/{id}")
    public ResponseEntity<TypeResponse> updateType(@PathVariable Integer id, @Valid @RequestBody TypeRequest request) {
        TypeResponse response = typeService.updateType(id, request);
        return ResponseEntity.ok(response);
    }
    @AdminContentCustomerAccess
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteType(@PathVariable Integer id) {
        typeService.deleteType(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("customer")
    public ResponseEntity<List<TypeResponse>> getAllTypesOnActive() {
        List<TypeResponse> responses = typeService.getAllTypesOnActive();
        return ResponseEntity.ok(responses);
    }
}
