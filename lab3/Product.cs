public class Product
{
    public int ProductID { get; set; }
    public string? ProductName { get; set; }
    public int UnitsInStock { get; set; }
    public Supplier? IsSuppliedBy { get; set; }

    public ICollection<Invoice> CanBeSoldIn { get; set; } = [];
}
