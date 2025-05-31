db.orders.insertOne(
{
    CustomerID: "ALFKI",
    EmployeeID: 5,
    Freight: 32.38,
    OrderDate: ISODate("2025-04-06T01:11:18.965Z"),
    OrderID: 20000,
    RequiredDate: ISODate("2025-04-15T01:11:18.965Z"),
    ShippedDate: ISODate("2025-04-11T01:11:18.965Z"),
    ShipAddress: "59 rue de l'Abbaye",
    ShipCity: "Reims",
    ShipCountry: "France",
    ShipName: "Vins et alcools Chevalier",
    ShipPostalCode: "51100",
    ShipRegion: "SP",
    ShipVia: 3
}
)

db.orderdetails.insertMany([
{
    Discount: 0.15,
    OrderID: 20000,
    ProductID: 1,
    Quantity: 2,
    UnitPrice: 18
},
{
    Discount: 0.05,
    OrderID: 20000,
    ProductID: 10,
    Quantity: 3,
    UnitPrice: 31
}
])


db.OrderInfo.insertOne(
{
    Customer: {
        CustomerID: "ALFKI",
        CompanyName: "Alfreds Futterkiste",
        City: "Berlin",
        Country: "Germany"
    },
    Dates: {
        OrderDate: ISODate("2025-04-06T01:11:18.965Z"),
        RequiredDate: ISODate("2025-04-15T01:11:18.965Z")
    },
    Employee: {
        EmployeeID: 5,
        FirstName: "Steven",
        LastName: "Buchanan",
        Title: "Sales Manager"
    },
    Freight: 32.38,
    OrderID: 20000,
    OrderTotal: 18 * 2 * (1 - 0.15) + 31 * 3 * (1 - 0.05),
    Orderdetails: [
        {
            Discount: 0.15,
            Quantity: 2,
            UnitPrice: 18,
            Value: 18 * 2 * (1 - 0.15),
            product: {
                CategoryID: 1,
                CategoryName: "Beverages",
                ProductName: "Chai",
                ProductID: 1,
                QuantityPerUnit: "10 boxes x 20 bags"
            }
        },
        {
            Discount: 0.05,
            Quantity: 3,
            UnitPrice: 31,
            Value: 31 * 3 * (1 - 0.05),
            product: {
                CategoryID: 8,
                CategoryName: "Seafood",
                ProductName: "Ikura",
                ProductID: 10,
                QuantityPerUnit: "12 - 200 ml jars"
            }
        }
    ],
    Shipment: {
        ShipAddress: "59 rue de l'Abbaye",
        ShipCity: "Reims",
        ShipCountry: "France",
        ShipName: "Vins et alcools Chevalier",
        Shipper: {
            ShipperID: 3,
            CompanyName: "Federal Shipping"
        }
    }
}
)


db.CustomerInfo.updateOne(
{
    CustomerID: "ALFKI"
},
{
    $push: {
        Orders: {
            Dates: {
                OrderDate: ISODate("2025-04-06T01:11:18.965Z"),
                RequiredDate: ISODate("2025-04-15T01:11:18.965Z")
            },
            Employee: {
                EmployeeID: 5,
                FirstName: "Steven",
                LastName: "Buchanan",
                Title: "Sales Manager"
            },
            Freight: 32.38,
            OrderID: 20000,
            OrderTotal: 18 * 2 * (1 - 0.15) + 31 * 3 * (1 - 0.05),
            Orderdetails: [
                {
                    Discount: 0.15,
                    Quantity: 2,
                    UnitPrice: 18,
                    Value: 18 * 2 * (1 - 0.15),
                    product: {
                        CategoryID: 1,
                        CategoryName: "Beverages",
                        ProductName: "Chai",
                        ProductID: 1,
                        QuantityPerUnit: "10 boxes x 20 bags"
                    }
                },
                {
                    Discount: 0.05,
                    Quantity: 3,
                    UnitPrice: 31,
                    Value: 31 * 3 * (1 - 0.05),
                    product: {
                        CategoryID: 8,
                        CategoryName: "Seafood",
                        ProductName: "Ikura",
                        ProductID: 10,
                        QuantityPerUnit: "12 - 200 ml jars"
                    }
                }
            ],
            Shipment: {
                ShipAddress: "59 rue de l'Abbaye",
                ShipCity: "Reims",
                ShipCountry: "France",
                ShipName: "Vins et alcools Chevalier",
                Shipper: {
                    ShipperID: 3,
                    CompanyName: "Federal Shipping"
                }
            }
        }
    }
}
)
