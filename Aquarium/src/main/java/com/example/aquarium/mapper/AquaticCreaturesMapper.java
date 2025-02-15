package com.example.aquarium.mapper;

import com.example.aquarium.bean.request.AquaticCreaturesRequest;
import com.example.aquarium.bean.response.AquaticCreaturesResponse;
import com.example.aquarium.bean.response.AquaticCreaturesResponse2;
import com.example.aquarium.bean.response.ImgResponse;
import com.example.aquarium.bean.response.SpeciesResponse2;
import com.example.aquarium.model.*;
import com.example.aquarium.service.ImgService;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Component
public class AquaticCreaturesMapper {

    private ImgService imgService;

    public AquaticCreaturesMapper(ImgService imgService) {
        this.imgService = imgService;
    }

    public static AquaticCreatures mapToEntity(AquaticCreaturesRequest request, Optional<User> user, Optional<Species> species) {
        AquaticCreatures aquaticCreatures = new AquaticCreatures();

        aquaticCreatures.setName(request.getName());
        aquaticCreatures.setSpecies(species.orElse(null));
        aquaticCreatures.setWeight(request.getWeight());
        aquaticCreatures.setLength(request.getLength());
        aquaticCreatures.setEntryDate(LocalDateTime.now());
        aquaticCreatures.setExhibitStatus(request.getExhibitStatus());

        aquaticCreatures.setUser(user.orElse(null));

        return aquaticCreatures;
    }

    public AquaticCreatures mapToEntityWithImages(AquaticCreaturesRequest request, Optional<User> user, Optional<Species> species) throws IOException {
        AquaticCreatures aquaticCreatures = mapToEntity(request, user, species);

        List<Img> imgList = IntStream.range(0, request.getImages().size())
                .filter(i -> !request.getImages().get(i).isEmpty())
                .mapToObj(i -> {
                    MultipartFile image = request.getImages().get(i);
                    String description = request.getDescriptions().get(i);

                    String imageName = null;
                    try {
                        imageName = imgService.saveImage(image);
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }

                    Img img = new Img();
                    img.setImgName(imageName);
                    img.setDescription(description);
                    img.setAquaticCreatures(aquaticCreatures);
                    return img;
                })
                .collect(Collectors.toList());

        aquaticCreatures.setImages(imgList);

        return aquaticCreatures;
    }
    public static AquaticCreaturesResponse2 toResponse2(Species species){
        AquaticCreaturesResponse2 aquaticCreaturesResponse2 = new AquaticCreaturesResponse2();
        if (!species.getAquaticCreatures().isEmpty()) {
            aquaticCreaturesResponse2.setImg(species.getAquaticCreatures().get(0).getImages().get(0).getImgName());
            aquaticCreaturesResponse2.setId(species.getAquaticCreatures().get(0).getId());
            aquaticCreaturesResponse2.setName(species.getAquaticCreatures().get(0).getName());
            aquaticCreaturesResponse2.setWeight(species.getAquaticCreatures().get(0).getWeight());
            aquaticCreaturesResponse2.setLength(species.getAquaticCreatures().get(0).getLength());
            aquaticCreaturesResponse2.setHabitat(species.getHabitat());
            aquaticCreaturesResponse2.setSpecialCharacteristics(species.getSpecialCharacteristics());
            aquaticCreaturesResponse2.setNameSpecies(species.getName());
        }else {
            return null;
        }
        return aquaticCreaturesResponse2;
    }

    public static AquaticCreaturesResponse toResponse(AquaticCreatures entity) {
        AquaticCreaturesResponse response = new AquaticCreaturesResponse();

        response.setId(entity.getId());
        response.setName(entity.getName());


        SpeciesResponse2 speciesResponse2 = new SpeciesResponse2();
        speciesResponse2.setId(entity.getSpecies().getId());
        speciesResponse2.setName(entity.getSpecies().getName());
        speciesResponse2.setHabitat(entity.getSpecies().getHabitat());
        speciesResponse2.setDiet(entity.getSpecies().getDiet());
        speciesResponse2.setAverageLifespan(entity.getSpecies().getAverageLifespan());
        speciesResponse2.setSpecialCharacteristics(entity.getSpecies().getSpecialCharacteristics());

        response.setSpecies(speciesResponse2);
        response.setWeight(entity.getWeight());
        response.setLength(entity.getLength());
        response.setEntryDate(entity.getEntryDate());
        response.setExhibitStatus(entity.getExhibitStatus());
        List<ImgResponse> imgResponses = entity.getImages().stream()
                .map(image -> {
                    ImgResponse imgResponse = new ImgResponse();
                    imgResponse.setId(image.getId());
                    imgResponse.setImgName(image.getImgName());
                    imgResponse.setDescription(image.getDescription());
                    return imgResponse;
                })
                .collect(Collectors.toList());

        response.setImg(imgResponses);
        return response;
    }
}
