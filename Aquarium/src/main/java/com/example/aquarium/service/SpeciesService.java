package com.example.aquarium.service;
import com.example.aquarium.bean.request.SpeciesRequest;
import com.example.aquarium.bean.response.AquaticCreaturesResponse2;
import com.example.aquarium.bean.response.SpeciesResponse;
import com.example.aquarium.bean.response.SpeciesResponse2;
import com.example.aquarium.exception.ResourceNotFoundException;
import com.example.aquarium.mapper.SpeciesMapper;
import com.example.aquarium.model.Species;
import com.example.aquarium.model.Status;
import com.example.aquarium.repository.AquaticCreaturesRepository;
import com.example.aquarium.repository.SpeciesRespository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SpeciesService {

    private final SpeciesRespository speciesRepository;
    private final AquaticCreaturesRepository aquaticCreaturesRepository;

    public Species addSpecies(SpeciesRequest speciesRequest) {
        Species species = SpeciesMapper.toEntity(speciesRequest);
        return speciesRepository.save(species);
    }

    public Optional<SpeciesResponse> findById(int id) {
        return speciesRepository.findById(id).map(SpeciesMapper::toResponse);
    }

    public List<SpeciesResponse> getAllSpecies() {
        List<Species> speciesList = speciesRepository.findAll();
        return speciesList.stream()
                .map(SpeciesMapper::toResponse)
                .collect(Collectors.toList());
    }
    public List<SpeciesResponse2> getAllSpecies2() {
        List<Species> speciesList = speciesRepository.findAll();
        return speciesList.stream()
                .map(SpeciesMapper::toResponse2)
                .collect(Collectors.toList());
    }

    public boolean hasAquaticCreatures(int speciesId) {
        return aquaticCreaturesRepository.existsBySpeciesId(speciesId);
    }

    public void deleteById(int id) {
        aquaticCreaturesRepository.updateAreaIdToNullBySpeciesId(id);
        // speciesRepository.deleteById(id);
    }

    public Species update(int id, SpeciesRequest speciesDetails) {
        Species species = speciesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Species not found"));
        species.setName(speciesDetails.getName());
        species.setHabitat(speciesDetails.getHabitat());
        species.setDiet(speciesDetails.getDiet());
        species.setAverageLifespan(speciesDetails.getAverageLifespan());
        species.setSpecialCharacteristics(speciesDetails.getSpecialCharacteristics());
        species.setStatus(Status.ACTIVE);
        return speciesRepository.save(species);
    }

}
