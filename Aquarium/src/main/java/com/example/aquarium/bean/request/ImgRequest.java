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
public class ImgRequest {
    @NotBlank(message = "Image name is required")
    private String imgName;

    @Size(max = 500, message = "Description can be at most 500 characters")
    private String description;
}

