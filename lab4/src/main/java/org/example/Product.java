package org.example;

import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int productId;
    private String productName;
    private int unitsInStock;
    @ManyToOne
    @JoinColumn(name="SUPPLIER_FK")
    private Supplier isSuppliedBy;
    @ManyToOne
    @JoinColumn(name="CATEGORY_FK")
    private Category category;
    // Dodałem cascade
    @ManyToMany(mappedBy="includes", cascade = CascadeType.PERSIST)
    private Set<Invoice> canBeSoldIn = new HashSet<>();

    public Product() {}

    public Product(String productName, int unitsInStock) {
        this.productName = productName;
        this.unitsInStock = unitsInStock;
    }

    public void setIsSuppliedBy(Supplier isSuppliedBy) {
        this.isSuppliedBy = isSuppliedBy;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getProductName() {
        return productName;
    }

    public void addCanBeSoldIn(Invoice invoice) {
        canBeSoldIn.add(invoice);
    }

    public Set<Invoice> getCanBeSoldIn() {
        return canBeSoldIn;
    }
}