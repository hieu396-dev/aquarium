package com.example.aquarium.model;

import jakarta.persistence.*;

import java.util.List;


@Entity
@Table(name = "species")
public class Species {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", unique = true, nullable = false)
    private String name;

    @Column(name = "habitat")
    private String habitat;

    @Column(name = "diet")
    private String diet;

    @Column(name = "average_lifespan")
    private Integer averageLifespan;

    @Column(name = "special_characteristics")
    private String specialCharacteristics;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @OneToMany(mappedBy = "species", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AquaticCreatures> aquaticCreatures;

    public List<AquaticCreatures> getAquaticCreatures() {
        return aquaticCreatures;
    }

    public void setAquaticCreatures(List<AquaticCreatures> aquaticCreatures) {
        this.aquaticCreatures = aquaticCreatures;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getHabitat() {
        return habitat;
    }

    public void setHabitat(String habitat) {
        this.habitat = habitat;
    }

    public String getDiet() {
        return diet;
    }

    public void setDiet(String diet) {
        this.diet = diet;
    }

    public Integer getAverageLifespan() {
        return averageLifespan;
    }

    public void setAverageLifespan(Integer averageLifespan) {
        this.averageLifespan = averageLifespan;
    }

    public String getSpecialCharacteristics() {
        return specialCharacteristics;
    }

    public void setSpecialCharacteristics(String specialCharacteristics) {
        this.specialCharacteristics = specialCharacteristics;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
