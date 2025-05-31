public class Supplier
{
    public int SupplierID { get; set; }
    public string? CompanyName { get; set; }
    public string? Street { get; set; }
    public string? City { get; set; }

    public ICollection<Product> Supplies { get; set; } = [];
}

// public class Supplier : Company
// {
//     public int SupplierID { get; set; }
//     public String? BankAccountNumber { get; set; }
// }
