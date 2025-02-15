package com.example.aquarium.bean.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SpeciesResponse2 {
    private int id;
    private String name;
    private String habitat;
    private String diet;
    private Integer averageLifespan;
    private String specialCharacteristics;
}
