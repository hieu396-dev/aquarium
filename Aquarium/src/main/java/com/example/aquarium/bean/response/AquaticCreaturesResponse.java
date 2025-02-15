package com.example.aquarium.bean.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class AquaticCreaturesResponse {
    private int id;
    private String name;
    private float weight;
    private float length;
    private LocalDateTime entryDate;
    private String exhibitStatus;
    private SpeciesResponse2 species;
    private List<ImgResponse> img;
}

