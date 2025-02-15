package com.example.aquarium.bean.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SpeciesResponse {
    private int id;
    private String name;
    private String habitat;
    private String diet;
    private Integer averageLifespan;
    private String specialCharacteristics;
    private List<String> aquaticCreaturesName;
}
