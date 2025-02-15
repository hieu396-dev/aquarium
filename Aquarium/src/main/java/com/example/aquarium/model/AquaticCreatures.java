package com.example.aquarium.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "aquatic_creatures")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class AquaticCreatures {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "species_id", nullable = false)
    private Species species;  // Tham chiếu đến loài

    @Column(name = "weight")
    private Float weight;

    @Column(name = "length")
    private Float length;

    @Column(name = "entry_date")
    private LocalDateTime entryDate;

    @Column(name = "exhibit_status")
    private String exhibitStatus;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "aquaticCreatures", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Img> images;
}
