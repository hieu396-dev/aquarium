package com.example.aquarium.mapper;

import com.example.aquarium.bean.request.TypeRequest;
import com.example.aquarium.bean.response.TypeResponse;
import com.example.aquarium.model.Status;
import com.example.aquarium.model.Type;
import org.springframework.stereotype.Component;

@Component
public class TypeMapper {

    public Type toEntity(TypeRequest request) {
        Type type = new Type();
        type.setTypeName(request.getTypeName());
        type.setPrice(request.getPrice());
        type.setDescription(request.getDescription());
        type.setStatus(request.getStatus());

        return type;
    }

    public TypeResponse toResponse(Type type) {
        TypeResponse response = new TypeResponse();
        response.setId(type.getId());
        response.setTypeName(type.getTypeName());
        response.setPrice(type.getPrice());
        response.setDescription(type.getDescription());
        response.setStatus(type.getStatus().toString());

        return response;
    }
}

