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
public class AquaticCreaturesResponse2 {
    private int id;
    private String name;
    private float weight;
    private float length;
    private String nameSpecies;
    private String habitat;
    private String specialCharacteristics;
    private String img;
}
