/* Console.WriteLine("Podaj nazwe produktu: ");
var prodName = Console.ReadLine();

var product = new Product { ProductName = prodName };
var prodContext = new ProdContext();
prodContext.Products.Add(product);
prodContext.SaveChanges();

var query = from prod in prodContext.Products
            select prod.ProductName;

Console.WriteLine("Lista produktów");

foreach (var p in query)
{
    Console.WriteLine(p);
} */

var prodContext = new ProdContext();
// Dodanie nowych faktur przeznaczonych do odpowiednich transakcji
var invoiceFlowers1 = new Invoice
{
    InvoiceNumber = 1,
    Quantity = 1
};
var invoiceFlowers2 = new Invoice
{
    InvoiceNumber = 2,
    Quantity = 3
};
var invoiceClothes = new Invoice
{
    InvoiceNumber = 3,
    Quantity = 5
};
prodContext.I
// Dodanie nowych produktów przeznaczonych do odpowiednich transakcji
List<Product> productsFlowers1 = [
    new Product
    {
        ProductName = "Tulipan",
        UnitsInStock = 20,
        CanBeSoldIn = [invoiceFlowers1, invoiceFlowers2]
    },
    new Product
    {
        ProductName = "Fiołek",
        UnitsInStock = 5,
        CanBeSoldIn = [invoiceFlowers1, invoiceFlowers2]
    },
    new Product
    {
        ProductName = "Storczyk",
        UnitsInStock = 3,
        CanBeSoldIn = [invoiceFlowers1, invoiceFlowers2]
    }];
List<Product> productsFlowers2 = [
    new Product
    {
        ProductName = "Róża",
        UnitsInStock = 2,
        CanBeSoldIn = [invoiceFlowers1, invoiceFlowers2]
    },
    new Product
    {
        ProductName = "Paproć",
        UnitsInStock = 1,
        CanBeSoldIn = [invoiceFlowers1, invoiceFlowers2]
    }];
List<Product> productsClothes = [
    new Product
    {
        ProductName = "Spodnie",
        UnitsInStock = 2,
        CanBeSoldIn = [invoiceClothes]
    },
    new Product
    {
        ProductName = "Koszula",
        UnitsInStock = 1,
        CanBeSoldIn = [invoiceClothes]
    }];
foreach (var p in productsFlowers1)
{
    prodContext.Products.Add(p);
}
foreach (var p in productsFlowers2)
{
    prodContext.Products.Add(p);
}
foreach (var p in productsClothes)
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
    p.IsSuppliedBy = supplier;
}
prodContext.SaveChanges();
