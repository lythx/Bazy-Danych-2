package org.example;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Customer extends Company {
    private double discount;

    public Customer() {}

    public Customer(String companyName, String city, String street, String zipCode, double discount) {
        super(companyName, city, street, zipCode);
        this.discount = discount;
    }

    @Override
    public String toString() {
        return "Customer(CompanyId: " + companyId + ", CompanyName: " +
            companyName + ", City: " + city + ", Street: "
            + street + ", ZipCode: " + zipCode + ", Discount: " + discount + ")";
    }
}
