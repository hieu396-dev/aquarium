package com.example.aquarium.bean.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AquaticCreaturesRequest {

    @NotBlank(message = "Name is mandatory")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String name;

    @PositiveOrZero(message = "Weight must be positive or zero")
    private float weight;

    @PositiveOrZero(message = "Length must be positive or zero")
    private float length;

    @NotBlank(message = "Exhibit status is mandatory")
    @Size(max = 50, message = "Exhibit status cannot exceed 50 characters")
    private String exhibitStatus;

    @NotNull(message = "User ID is mandatory")
    private Integer userId;

    @NotNull(message = "Species ID is mandatory")
    @Min(value = 1, message = "Species ID is mandatory")
    private Integer speciesId;

    @NotEmpty(message = "Images cannot be empty")
    private List<MultipartFile> images = new ArrayList<>();

    @NotEmpty(message = "Descriptions cannot be empty")
    private List<String> descriptions = new ArrayList<>();
}

