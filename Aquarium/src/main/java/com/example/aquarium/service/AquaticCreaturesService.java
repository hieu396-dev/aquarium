package com.example.aquarium.service;

import com.example.aquarium.bean.request.AquaticCreaturesRequest;
import com.example.aquarium.bean.response.AquaticCreaturesResponse;
import com.example.aquarium.bean.response.AquaticCreaturesResponse2;
import com.example.aquarium.exception.ResourceNotFoundException;
import com.example.aquarium.exception.UniqueConstraintViolationException;
import com.example.aquarium.mapper.AquaticCreaturesMapper;
import com.example.aquarium.model.AquaticCreatures;
import com.example.aquarium.model.Img;
import com.example.aquarium.model.Species;
import com.example.aquarium.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class AquaticCreaturesService {

    private final AquaticCreaturesRepository aquaticCreaturesRepository;
    private final AquaticCreaturesMapper aquaticCreaturesMapper;
    private final UserRepository userRepository;
    private final ImgRepository imgRepository;
    private final SpeciesRespository speciesRespository;
    private final ImgService imgService;


    public AquaticCreatures createAquaticCreature(AquaticCreaturesRequest aquaticCreaturesRequest) throws IOException {
        if (aquaticCreaturesRepository.existsAquaticCreaturesByName(aquaticCreaturesRequest.getName())) {
            throw new UniqueConstraintViolationException("name '" + aquaticCreaturesRequest.getName() + "' already exists.");
        }
        AquaticCreatures aquaticCreatures = aquaticCreaturesMapper.mapToEntityWithImages(
                aquaticCreaturesRequest,
                userRepository.findById(aquaticCreaturesRequest.getUserId()),
                speciesRespository.findById(aquaticCreaturesRequest.getSpeciesId())
        );
        return aquaticCreaturesRepository.save(aquaticCreatures);
    }

    public List<AquaticCreaturesResponse> getAllAquaticCreatures() {
        List<AquaticCreatures> creatures =
                aquaticCreaturesRepository.findAll();
        return creatures.stream()
                .map(AquaticCreaturesMapper::toResponse)
                .collect(Collectors.toList());
    }


    public AquaticCreaturesResponse getAquaticCreatureById(int id) {
        AquaticCreatures creature = aquaticCreaturesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aquatic Creature not found"));
        return AquaticCreaturesMapper.toResponse(creature);
    }


    public AquaticCreatures updateAquaticCreature(Integer id, AquaticCreaturesRequest aquaticCreaturesRequest) throws IOException {
        AquaticCreatures aquaticCreatures = aquaticCreaturesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aquatic Creature not found"));
        aquaticCreatures.getImages().clear();

        aquaticCreatures.setName(aquaticCreaturesRequest.getName());
        aquaticCreatures.setWeight(aquaticCreaturesRequest.getWeight());
        aquaticCreatures.setLength(aquaticCreaturesRequest.getLength());
        aquaticCreatures.setExhibitStatus(aquaticCreaturesRequest.getExhibitStatus());
        aquaticCreatures.setUser(userRepository.findById(aquaticCreaturesRequest.getUserId()).orElse(null));
        aquaticCreatures.setSpecies(speciesRespository.findById(aquaticCreaturesRequest.getSpeciesId()).orElse(null));

        List<Img> images = IntStream.range(0, aquaticCreaturesRequest.getImages().size())
                .filter(i -> !aquaticCreaturesRequest.getImages().get(i).isEmpty())
                .mapToObj(i -> {
                    MultipartFile image = aquaticCreaturesRequest.getImages().get(i);
                    String description = aquaticCreaturesRequest.getDescriptions().get(i);

                    String imageName = null;
                    try {
                        imageName = imgService.saveImage(image);  // Lưu ảnh và lấy tên ảnh
                    } catch (IOException e) {
                        throw new RuntimeException("Error saving image: " + e.getMessage(), e);
                    }

                    Img img = new Img();
                    img.setImgName(imageName);
                    img.setDescription(description);
                    img.setAquaticCreatures(aquaticCreatures);
                    return img;
                })
                .collect(Collectors.toList());

        aquaticCreatures.getImages().addAll(images);

        return aquaticCreaturesRepository.save(aquaticCreatures);
    }

    public void deleteAquaticCreature(Integer id) {
        AquaticCreatures aquaticCreatures = aquaticCreaturesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aquatic Creature not found"));
        aquaticCreatures.getImages().clear();
        aquaticCreaturesRepository.deleteById(id);
    }
    public List<AquaticCreaturesResponse2> getAllDistinctCreatures() {
        List<Species> speciesList = speciesRespository.findAll();
        return speciesList.stream()
                .map(AquaticCreaturesMapper::toResponse2)
                .filter(response -> response != null)
                .distinct()
                .collect(Collectors.toList());
    }
}

