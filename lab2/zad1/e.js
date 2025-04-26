db.products.findOne({
    ProductName: "Chai"
})

db.products.findOne({
    ProductName: "Ikura"
})

db.orders.insertOne({
    CustomerID: "ALFKI",
    EmployeeID: 5,
    Freight: 32.38,
    OrderDate: ISODate("2025-04-06T01:11:18.965Z"),
    OrderID: 10000,
    RequiredDate: ISODate("2025-04-15T01:11:18.965Z"),
    ShippedDate: ISODate("2025-04-11T01:11:18.965Z"),
    ShipAddress: "59 rue de l'Abbaye",
    ShipCity: "Reims",
    ShipCountry: "France",
    ShipName: "Vins et alcools Chevalier",
    ShipPostalCode: "51100",
    ShipRegion: "SP",
    ShipVia: 3
})

db.orderdetails.insertMany([
{
    Discount: 0.15,
    OrderID: 10000,
    ProductID: 1,
    Quantity: 2,
    UnitPrice: 18
},
{
    Discount: 0.05,
    OrderID: 10000,
    ProductID: 10,
    Quantity: 3,
    UnitPrice: 31
}
])

//({
//    "_id": {"$oid": "63a0607abb3b972d6f4e1f50"},
//    "CategoryID": 1,
//    "Discontinued": false,
//    "ProductID": 1,
//    "ProductName": "Chai",
//    "QuantityPerUnit": "10 boxes x 20 bags",
//    "ReorderLevel": 10,
//    "SupplierID": 1,
//    "UnitPrice": 18,
//    "UnitsInStock": 39,
//    "UnitsOnOrder": 0
//})

//({
//    "_id": {"$oid": "63a0607abb3b972d6f4e1f59"},
//    "CategoryID": 8,
//    "Discontinued": false,
//    "ProductID": 10,
//    "ProductName": "Ikura",
//    "QuantityPerUnit": "12 - 200 ml jars",
//    "ReorderLevel": 0,
//    "SupplierID": 4,
//    "UnitPrice": 31,
//    "UnitsInStock": 31,
//    "UnitsOnOrder": 0
//})