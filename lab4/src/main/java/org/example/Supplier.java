package org.example;

import jakarta.persistence.*;

@Entity
public class Supplier extends Company {
    private String bankAccountNumber;

    public Supplier() {}

    public Supplier(String companyName, String city, String street, String zipCode, String bankAccountNumber) {
        super(companyName, city, street, zipCode);
        this.bankAccountNumber = bankAccountNumber;
    }

    @Override
    public String toString() {
        return "Supplier(CompanyId: " + companyId + ", CompanyName: " +
            companyName + ", City: " + city + ", Street: "
            + street + ", ZipCode: " + zipCode + ", BankAccountNumber: " + bankAccountNumber + ")";
    }
}
