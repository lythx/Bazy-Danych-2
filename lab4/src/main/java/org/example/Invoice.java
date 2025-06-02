package org.example;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
public class Invoice {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int invoiceId;
    private int invoiceNumber;
    private int quantity;
    // Dodałem cascade
    @ManyToMany(cascade = CascadeType.PERSIST)
    private Set<Product> includes = new HashSet<>();

    public Invoice() {}

    public Invoice(int invoiceNumber, int quantity, Set<Product> includes) {
        this.invoiceNumber = invoiceNumber;
        this.quantity = quantity;
        this.includes = includes;
    }

    public Set<Product> getIncludes() {
        return includes;
    }

    public int getInvoiceNumber() {
        return invoiceNumber;
    }
}
