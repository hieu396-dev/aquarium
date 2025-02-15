package com.example.aquarium.controller;

import com.example.aquarium.bean.request.AquaticCreaturesRequest;
import com.example.aquarium.bean.response.AquaticCreaturesResponse;
import com.example.aquarium.bean.response.AquaticCreaturesResponse2;
import com.example.aquarium.bean.response.MessageResponse;
import com.example.aquarium.bean.response.SpeciesResponse2;
import com.example.aquarium.model.AquaticCreatures;
import com.example.aquarium.security.interfaceRole.*;
import com.example.aquarium.service.AquaticCreaturesService;
import com.example.aquarium.service.SpeciesService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/aquatic-creatures")
@RequiredArgsConstructor
public class AquaticCreaturesController {


    private final AquaticCreaturesService service;
    private final SpeciesService service2;

    @AdminAndContentStaffAccess
    @PostMapping
    public ResponseEntity<?> createAquaticCreature(@Valid @ModelAttribute AquaticCreaturesRequest creature) {
        try {
            AquaticCreatures createdCreature = service.createAquaticCreature(creature);
            return new ResponseEntity<>(new MessageResponse("Successfully!"), HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(new MessageResponse("Error occurred while saving creature!"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping()
    public ResponseEntity<List<AquaticCreaturesResponse>> getAllAquaticCreatures() {
        List<AquaticCreaturesResponse> response = service.getAllAquaticCreatures();
        return ResponseEntity.ok(response);
    }
    @GetMapping("/species")
    public ResponseEntity<List<SpeciesResponse2>> getAllSpecies() {
        List<SpeciesResponse2> response = service2.getAllSpecies2();
        return ResponseEntity.ok(response);
    }
    @GetMapping("/{id}")
    public ResponseEntity<AquaticCreaturesResponse> getAquaticCreatureById(@PathVariable int id) {
        AquaticCreaturesResponse response = service.getAquaticCreatureById(id);
        return ResponseEntity.ok(response);
    }
    @AdminAndContentStaffAccess
    @PutMapping("/{id}")
    public ResponseEntity<MessageResponse> updateAquaticCreature(@PathVariable Integer id, @ModelAttribute AquaticCreaturesRequest creature) throws IOException {
        try {
            AquaticCreatures updatedCreature = service.updateAquaticCreature(id, creature);
            return new ResponseEntity<>(new MessageResponse("Successfully!"), HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(new MessageResponse("Error occurred while saving creature!"), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @AdminAndContentStaffAccess
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAquaticCreature(@PathVariable Integer id) {
        service.deleteAquaticCreature(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/distinct-creatures")
    public ResponseEntity<List<AquaticCreaturesResponse2>> getAllDistinctCreatures() {
        List<AquaticCreaturesResponse2> response = service.getAllDistinctCreatures();
        return ResponseEntity.ok(response);
    }
}

