package com.example.aquarium.repository;

import com.example.aquarium.model.Feedback;
import com.example.aquarium.model.Img;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImgRepository extends JpaRepository<Img, Integer> {
    List<Img> findImgsByAquaticCreaturesId(Integer id);
}
