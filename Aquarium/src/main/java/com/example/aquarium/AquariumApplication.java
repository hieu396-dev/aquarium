package com.example.aquarium;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.example.aquarium.repository")
@EntityScan(basePackages = "com.example.aquarium.model")
@EnableScheduling
public class AquariumApplication {

    public static void main(String[] args) {
        SpringApplication.run(AquariumApplication.class, args);
    }

}
