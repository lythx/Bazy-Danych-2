package org.example;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;

import javax.management.Query;
import java.util.List;
import java.util.Set;

public class Main {
    private static SessionFactory sessionFactory = null;

    public static void main(String[] args) {
//        Product product = new Product("Kredki", 111);
//        Transaction tx = session.beginTransaction();
//        session.save(product);
//        tx.commit();

//        tx = session.beginTransaction();
//        var supplier = new Supplier("Inpost", "Kawiory", "Kraków");
//        session.save(supplier);
//        product = session.get(Product.class, 1);
//        product.setIsSuppliedBy(supplier);
//        session.save(product);

//        tx = session.beginTransaction();
//        var supplier = new Supplier("Inpost", "Kawiory", "Kraków");
//        product = session.get(Product.class, 1);
//        supplier.addSuppliedProduct(product);
//        session.save(supplier);
//        tx.commit();

//        tx = session.beginTransaction();
//        var supplier = new Supplier("Inpost", "Kawiory", "Kraków");
//        product = session.get(Product.class, 1);
//        product.setIsSuppliedBy(supplier);
//        supplier.addSuppliedProduct(product);
//        session.save(supplier);
//        tx.commit();
//
//        sessionFactory = getSessionFactory();
//        var session = sessionFactory.openSession();
//        var tx = session.beginTransaction();
//
//        var klawiatura = new Product("Klawiatura", 25);
//        var myszka = new Product("Myszka", 22);
//        var zasilacz = new Product("Zasilacz", 0);
//
//        var tulipan = new Product("Tulipan", 20);
//        var storczyk = new Product("Storczyk", 3);
//
//        var buty = new Product("Buty", 2);
//        var spodnie = new Product("Spodnie", 15);
//
//        var peryferia = new Category(
//            "Peryferia",
//            List.of(klawiatura, myszka, zasilacz)
//        );
//        klawiatura.setCategory(peryferia);
//        myszka.setCategory(peryferia);
//        zasilacz.setCategory(peryferia);
//        session.save(klawiatura);
//        session.save(myszka);
//        session.save(zasilacz);
//        session.save(peryferia);
//
//        var kwiaty = new Category(
//            "Kwiaty",
//            List.of(tulipan, storczyk)
//        );
//        tulipan.setCategory(kwiaty);
//        storczyk.setCategory(kwiaty);
//        session.save(tulipan);
//        session.save(storczyk);
//        session.save(kwiaty);
//
//        var ubrania = new Category(
//            "Ubrania",
//            List.of(buty, spodnie)
//        );
//        buty.setCategory(ubrania);
//        spodnie.setCategory(ubrania);
//        session.save(buty);
//        session.save(spodnie);
//        session.save(ubrania);
//
//        tx.commit();
//
//        tx = session.beginTransaction();
//        var query = session.createQuery("from Category as cat where cat.categoryName='Ubrania'");
//        var kategoria = (Category) query.getSingleResult();
//        System.out.println("Produkty z kategorii Ubrania:");
//        for (var p : kategoria.getProducts()) {
//            System.out.println(p.getProductName());
//        }
//        tx.commit();
//
//        session.close();

        var sessionFactory = getSessionFactory();
        var session = sessionFactory.openSession();
        var tx = session.beginTransaction();

        var tulipan = new Product("Tulipan", 20);
        var fiolek = new Product("Fiołek", 5);
        var storczyk = new Product("Storczyk", 3);
        var roza = new Product("Róża", 3);

        var invoice1 = new Invoice(1, 4, Set.of(tulipan, fiolek, storczyk, roza));
        tulipan.addCanBeSoldIn(invoice1);
        fiolek.addCanBeSoldIn(invoice1);
        storczyk.addCanBeSoldIn(invoice1);
        roza.addCanBeSoldIn(invoice1);

        var invoice2 = new Invoice(2, 3, Set.of(tulipan, fiolek, storczyk));
        tulipan.addCanBeSoldIn(invoice2);
        fiolek.addCanBeSoldIn(invoice2);
        storczyk.addCanBeSoldIn(invoice2);

        var invoice3 = new Invoice(3, 1, Set.of(tulipan));
        tulipan.addCanBeSoldIn(invoice3);

        var invoice4 = new Invoice(4, 1, Set.of(fiolek, roza));
        fiolek.addCanBeSoldIn(invoice4);
        roza.addCanBeSoldIn(invoice4);

        session.save(tulipan);
        session.save(fiolek);
        session.save(storczyk);
        session.save(roza);

        session.save(invoice1);
        session.save(invoice2);
        session.save(invoice3);
        session.save(invoice4);

        tx.commit();

        // Pokazanie produktów sprzedanych w ramach faktury nr. 1
        tx = session.beginTransaction();
        var query1 = session.createQuery("from Invoice as inv where inv.invoiceNumber=1");
        var faktura = (Invoice) query1.getSingleResult();

        // Pokazanie faktur w których sprzedano tulipany
        var query2 = session.createQuery("from Product as prod where prod.productName='Tulipan'");
        var produkt = (Product) query2.getSingleResult();

        System.out.print("Produkty sprzedane w ramach faktury nr 1: ");
        for (var p : faktura.getIncludes()) {
            System.out.print(p.getProductName() + " ");
        }
        System.out.print("\n");

        System.out.print("Numery faktur, w których sprzedano tulipany: ");
        for (var i : produkt.getCanBeSoldIn()) {
            System.out.print(i.getInvoiceNumber() + " ");
        }
        tx.commit();

        session.close();
    }

    private static SessionFactory getSessionFactory() {
        if (sessionFactory == null) {
            Configuration configuration = new Configuration();
            sessionFactory = configuration.configure().buildSessionFactory();
        }
        return sessionFactory;
    }
}