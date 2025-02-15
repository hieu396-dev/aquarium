package com.example.aquarium.controller;

import com.example.aquarium.bean.request.SpeciesRequest;
import com.example.aquarium.bean.response.MessageResponse;
import com.example.aquarium.bean.response.SpeciesResponse;
import com.example.aquarium.model.Species;
import com.example.aquarium.security.interfaceRole.*;
import com.example.aquarium.service.SpeciesService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/species")
@RequiredArgsConstructor
public class SpeciesController {

    private final SpeciesService speciesService;


    @AdminAndContentStaffAccess
    @PostMapping
    public ResponseEntity<MessageResponse> createSpecies(@Valid @RequestBody SpeciesRequest speciesRequest) {
        Species savedSpecies = speciesService.addSpecies(speciesRequest);
        return new ResponseEntity<>(new MessageResponse("Successfully created species!"), HttpStatus.CREATED);
    }
    @GetMapping
    public ResponseEntity<List<SpeciesResponse>> getAllSpecies() {
        List<SpeciesResponse> speciesList = speciesService.getAllSpecies();
        return new ResponseEntity<>(speciesList, HttpStatus.OK);
    }

    @AdminContentCustomerAccess
    @PutMapping("/{id}")
    public ResponseEntity<MessageResponse> updateSpecies(@PathVariable int id, @Valid @RequestBody SpeciesRequest speciesRequest) {
        Species updatedSpecies = speciesService.update(id, speciesRequest);
        return new ResponseEntity<>(new MessageResponse("Successfully"), HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public Optional<SpeciesResponse> getSpeciesById(@PathVariable int id) {
        return speciesService.findById(id);
    }

    @AdminAndContentStaffAccess
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSpecies(@PathVariable int id) {
        speciesService.deleteById(id);
        return new ResponseEntity<>("Species deleted successfully.", HttpStatus.NO_CONTENT);
    }

}
