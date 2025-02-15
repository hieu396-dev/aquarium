package com.example.aquarium.service;

import com.example.aquarium.bean.request.TypeRequest;
import com.example.aquarium.bean.response.OrderResponse;
import com.example.aquarium.bean.response.TypeResponse;
import com.example.aquarium.exception.ResourceNotFoundException;
import com.example.aquarium.exception.UniqueConstraintViolationException;
import com.example.aquarium.mapper.TypeMapper;
import com.example.aquarium.model.Status;
import com.example.aquarium.model.Type;
import com.example.aquarium.repository.TypeRepository;
import com.example.aquarium.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TypeService {


    private final TypeRepository typeRepository;

    private final TypeMapper typeMapper;

    public TypeResponse createType(TypeRequest request) {
        if (typeRepository.existsByTypeName(request.getTypeName())) {
            throw new UniqueConstraintViolationException("typeName '" + request.getTypeName() + "' already exists.");
        }
        Type type = typeMapper.toEntity(request);
        type.setStatus(Status.ACTIVE);
        type = typeRepository.save(type);
        return typeMapper.toResponse(type);
    }

    public Optional<TypeResponse> getType(Integer id) {
        return typeRepository.findById(id).map(order -> typeMapper.toResponse(order));
    }

    public List<TypeResponse> getAllTypes() {
        List<Type> types = typeRepository.findAll();
        return types.stream()
                .map(typeMapper::toResponse)
                .collect(Collectors.toList());
    }

    public List<TypeResponse> getAllTypesOnActive() {
        List<Type> types = typeRepository.findAll();
        List<Type> activeTypes = types.stream()
                .filter(type -> type.getStatus() == Status.ACTIVE)
                .collect(Collectors.toList());
        return activeTypes.stream()
                .map(typeMapper::toResponse)
                .collect(Collectors.toList());
    }


    public TypeResponse updateType(Integer id, TypeRequest request) {
        Type existingType = typeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Type not found with id: " + id));

        existingType.setTypeName(request.getTypeName());
        existingType.setPrice(request.getPrice());
        existingType.setDescription(request.getDescription());
        existingType.setStatus(request.getStatus());

        Type updatedType = typeRepository.save(existingType);
        return typeMapper.toResponse(updatedType);
    }

    public void deleteType(Integer id) {
        Type type = typeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Type not found with id: " + id));
        typeRepository.delete(type);
    }
}
