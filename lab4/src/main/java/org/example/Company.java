package org.example;

import jakarta.persistence.*;

@Entity
@Inheritance(strategy=InheritanceType.TABLE_PER_CLASS)
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    protected int companyId;
    protected String companyName;
    protected String city;
    protected String street;
    protected String zipCode;

    public Company() {}

    public Company(String companyName, String city, String street, String zipCode) {
        this.companyName = companyName;
        this.city = city;
        this.street = street;
        this.zipCode = zipCode;
    }

    @Override
    public String toString() {
        return "Company(CompanyId: " + companyId + ", CompanyName: " +
            companyName + ", City: " + city + ", Street: "
            + street + ", ZipCode: " + zipCode + ")";
    }
}