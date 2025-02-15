package com.example.aquarium.bean.request;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FeedbackRequest {

    @NotBlank(message = "Content is mandatory")
    private String content;
    private Integer userId;
}

