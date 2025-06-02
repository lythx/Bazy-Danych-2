package org.example;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Embeddable
public class Address {

    private String city;
    private String street;

    public Address() {}

    public Address(String city, String street) {
        this.city = city;
        this.street = street;
    }

}
