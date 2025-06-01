
using System.Text.Json;

var prodContext = new ProdContext();

var supplier1 = new Supplier
{
    CompanyName = "DHL",
    Street = "Wielicka",
    City = "Kraków"
};
var supplier2 = new Supplier
{
    CompanyName = "MAERSK",
    Street = "Długa",
    City = "Warszawa"
};
prodContext.Suppliers.AddRange(supplier1, supplier2);

var customer1 = new Customer
{
    CompanyName = "Wedel",
    Street = "Myślenicka",
    City = "Kraków"
};
var customer2 = new Customer
{
    CompanyName = "Wedel",
    Street = "Prosta",
    City = "Wrocław"
};
prodContext.Customers.AddRange(customer1, customer2);

prodContext.SaveChanges();


// Pobranie firmy o danej nazwie
var query1 = from comp in prodContext.Suppliers
             where comp.CompanyName == "Wedel"
             select comp;
var query2 = from comp in prodContext.Companies
             where comp.CompanyName == "Wedel"
             select comp;
var company = query1.First();
Console.WriteLine(JsonSerializer.Serialize(company));

// Pobranie dostawcy o danym numberze konta w banku
var query3 = from supp in prodContext.Suppliers
             where supp.BankAccountNumber == "PL91 1378 1462 6908 8595 1014 0748"
             select supp;
var supplier = query2.First();
Console.WriteLine(JsonSerializer.Serialize(supplier));
