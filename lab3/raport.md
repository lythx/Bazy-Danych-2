### a)

Modyfikacje modelu danych:

```cs
// Dodałem klasę dostawcy
public class Supplier
{
    public int SupplierID { get; set; }
    public string? CompanyName { get; set; }
    public string? Street { get; set; }
    public string? City { get; set; }
}
```

```cs
public class Product
{
    public int ProductID { get; set; }
    public string? ProductName { get; set; }
    public int UnitsInStock { get; set; }
    // Dodałem pole tworzące relację
    public Supplier? IsSuppliedBy { get; set; }
}
```

Kod dodający dostawcę, znajdujący wcześniej dodany produkt i ustawiający jego dostawcę na nowo dodanego:

```cs
var prodContext = new ProdContext();
// Dodanie nowego dostawcy
var supplier = new Supplier
{
    CompanyName = "Inpost",
    Street = "Kawiory",
    City = "Krakow"
};
prodContext.Suppliers.Add(supplier);
// Znalezienie wcześniej dodanego produktu w bazie danych
var query = from prod in prodContext.Products
            where prod.ProductName == "Flamaster"
            select prod;
var product = query.First();
// Ustawienie dostawcy
product.IsSuppliedBy = supplier;
prodContext.SaveChanges();
```

### b)

Modyfikacje modelu danych:

```cs
public class Product
{
    public int ProductID { get; set; }
    public string? ProductName { get; set; }
    public int UnitsInStock { get; set; }
    // Usunąłem pole IsSuppliedBy
}
```

```cs
public class Supplier
{
    public int SupplierID { get; set; }
    public string? CompanyName { get; set; }
    public string? Street { get; set; }
    public string? City { get; set; }
    // Dodałem pole tworzące relację
    public ICollection<Product> Supplies { get; set; } = [];
}
```

Kod dodajacy kilka produktów, znajdujący wcześniej dodanego dostawcę i dodający produkty jako dostarczane przez tego dostawcę.

```cs
var prodContext = new ProdContext();
// Dodanie kilku produktów
List<Product> products = [
    new Product
    {
        ProductName = "Ołówek",
        UnitsInStock = 4000
    },
    new Product
    {
        ProductName = "Laptop",
        UnitsInStock = 4
    },
    new Product
    {
        ProductName = "Zeszyt",
        UnitsInStock = 17
    }];
foreach (var p in products)
{
    prodContext.Products.Add(p);
}

// Znalezienie wcześniej dodanego dostawcy
var query = from supp in prodContext.Suppliers
            where supp.CompanyName == "Inpost"
            select supp;
var supplier = query.First();

// Dodanie produktów jako dostarczanych przez tego dostawcę
foreach (var p in products)
{
    supplier.Supplies.Add(p);
}
prodContext.SaveChanges();
```

### c)

Modyfikacje modelu danych:

```cs
public class Product
{
    public int ProductID { get; set; }
    public string? ProductName { get; set; }
    public int UnitsInStock { get; set; }
    // Dodałem wcześniej usunięte pole tworzące relację
    public Supplier? IsSuppliedBy { get; set; }
}
```

Kod dodajacy kilka produktów, znajdujący wcześniej dodanego dostawcę, dodający produkty jako dostarczane przez tego dostawcę i ustawiający dostawcę dla każdego produktu.

```cs
var prodContext = new ProdContext();
// Dodanie kilku produktów
List<Product> products = [
    new Product
    {
        ProductName = "Klawiatura",
        UnitsInStock = 35
    },
    new Product
    {
        ProductName = "Myszka",
        UnitsInStock = 22
    },
    new Product
    {
        ProductName = "Zasilacz",
        UnitsInStock = 0
    }];
foreach (var p in products)
{
    prodContext.Products.Add(p);
}

// Znalezienie wcześniej dodanego dostawcy
var query = from supp in prodContext.Suppliers
            where supp.CompanyName == "Inpost"
            select supp;
var supplier = query.First();

// Dodanie produktów jako dostarczanych przez tego dostawcę i ustawienie dostawcy dla każdego produktu
foreach (var p in products)
{
    supplier.Supplies.Add(p);
    p.IsSuppliedBy = supplier;
}
prodContext.SaveChanges();
```

# d)

Modyfikacje modelu danych:

```cs
// Dodałem klasę faktury
public class Invoice
{
    public int InvoiceID { get; set; }
    public int InvoiceNumber { get; set; }
    public int Quantity { get; set; }
    public ICollection<Product> Includes { get; set; } = [];
}
```

```cs
public class Product
{
    public int ProductID { get; set; }
    public string? ProductName { get; set; }
    public int UnitsInStock { get; set; }
    public Supplier? IsSuppliedBy { get; set; }
    // Dodałem pole tworzące relację
    public ICollection<Invoice> CanBeSoldIn { get; set; } = [];
}
```
