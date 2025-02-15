package com.example.aquarium.bean.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MessageResponse {

    private String message;
    private Map<String, String> errors;

    public MessageResponse(String message) {
        this.message = message;
    }
}
