package com.example.aquarium.bean.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserInfo {
    private int id;
    private String firstName;
    private String lastName;
    private String email;
    private String address;
    private String phone;
    private String accountStatus;
    private String roleName;
    private int loyaltyPoints;
    private double loyaltyPointValue;
    private Date createdAt;

}


