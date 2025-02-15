package com.example.aquarium.bean.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SpeciesRequest {

    @NotBlank(message = "Species name is required")
    @Size(max = 100, message = "Species name must not exceed 100 characters")
    private String name;

    @NotBlank(message = "Habitat is required")
    @Size(max = 50, message = "Habitat must not exceed 50 characters")
    private String habitat;

    @NotBlank(message = "Diet is required")
    @Size(max = 100, message = "Diet must not exceed 100 characters")
    private String diet;

    private Integer averageLifespan;

    @Size(max = 255, message = "Special characteristics must not exceed 255 characters")
    private String specialCharacteristics;

}
