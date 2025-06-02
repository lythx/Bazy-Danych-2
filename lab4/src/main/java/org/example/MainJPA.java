package org.example;
import jakarta.persistence.Persistence;

import java.util.HashSet;
import java.util.Set;

public class MainJPA {

    public static void main(String[] args) {
        var emf = Persistence.createEntityManagerFactory("SzymonZukDatabase");
        var em = emf.createEntityManager();
        var etx = em.getTransaction();
        etx.begin();

        var supplier1 = new Supplier("Inpost", "Kraków", "Kawiory", "00-123",
            "PL37 5269 6062 3118 6527 8335 6401");
        var supplier2 = new Supplier("DHL", "Warszawa", "Myślenicka", "13-125",
            "PL91 1378 1462 6908 8595 1014 0748");

        var customer1 = new Customer("Wedel", "Radom", "Łużycka", "72-244", 0.05);
        var customer2 = new Customer("Milka", "Kraków", "Basztowa", "82-214", 0.05);

        em.persist(supplier1);
        em.persist(supplier2);
        em.persist(customer1);
        em.persist(customer2);

        var query1 = em.createQuery("from Supplier as s " +
            "where s.bankAccountNumber='PL91 1378 1462 6908 8595 1014 0748'", Supplier.class);

        var query2 = em.createQuery("from Customer as c where c.zipCode='72-244'", Customer.class);

        var query3 = em.createQuery("from Company as c where c.city='Kraków'", Company.class);

        var supplier = query1.getSingleResult();
        var customer = query2.getSingleResult();
        var companies = query3.getResultList();

        System.out.println("Dostawca z numerem konta w banku PL91 1378 1462 6908 8595 1014 0748:");
        System.out.println(supplier);
        System.out.println("Klient z kodem pocztowym 13-125:");
        System.out.println(customer);
        System.out.println("Firmy z Krakowa:");
        for (var c : companies) {
            System.out.println(c);
        }

        etx.commit();
        em.close();
    }

}