package com.example.aquarium.service;

import com.example.aquarium.model.Role;
import com.example.aquarium.model.User;
import com.example.aquarium.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        Role role = user.getRole();
        if (role == null) {
            throw new UsernameNotFoundException("User role not found");
        }

        List<GrantedAuthority> authorities = new ArrayList<>();

        authorities.addAll(role.getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermissionName()))
                .collect(Collectors.toList()));


        authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getRoleName()));
        System.out.println("1");
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), authorities);
    }

}
