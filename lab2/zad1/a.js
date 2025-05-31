db.orderdetails.aggregate(
{
    $lookup: {
        from: "products",
        localField: "ProductID",
        foreignField: "ProductID",
        as: "product"
    }

},
{
    $unwind: "$product"
},
{
    $project: {
        ProductID: 0,
        "product.SupplierID": 0,
        "product.UnitPrice": 0,
        "product.UnitsInStock": 0,
        "product.ReorderLevel": 0,
        "product.Discontinued": 0,
        "product.UnitsOnOrder": 0,
        "product._id": 0
    }
},
{
    $lookup: {
        from: "categories",
        localField: "product.CategoryID",
        foreignField: "CategoryID",
        as: "category"
    }
},
{
    $unwind: "$category"
},
{
    $addFields: {
        "product.CategoryName": "$category.CategoryName"
    }
},
{
    $project: {
        category: 0
    }
},
{
    $sort: {
        "product.ProductID": 1
    }
},
{
    $out: "orderdetails_tmp"
}
)

db.orders.aggregate(
// Customer
{
    $lookup: {
        from: "customers",
        localField: "CustomerID",
        foreignField: "CustomerID",
        as: "Customer"
    }

},
{
    $unwind: "$Customer"
},
{
    $project: {
        "Customer._id": 0,
        "Customer.ContactName": 0,
        "Customer.ContactTitle": 0,
        "Customer.Address": 0,
        "Customer.PostalCode": 0,
        "Customer.Region": 0,
        "Customer.Phone": 0,
        "Customer.Fax": 0
    }
},


// Employee
{
    $lookup: {
        from: "employees",
            localField: "EmployeeID",
            foreignField: "EmployeeID",
            as: "Employee"
    }
},
{
    $unwind: "$Employee"
},
{
    $project: {
        "Employee._id": 0,
        "Employee.TitleOfCourtesy": 0,
        "Employee.BirthDate": 0,
        "Employee.HireDate": 0,
        "Employee.Address": 0,
        "Employee.PostalCode": 0,
        "Employee.City": 0,
        "Employee.Region": 0,
        "Employee.Country": 0,
        "Employee.HomePhone": 0,
        "Employee.Extension": 0,
        "Employee.Photo": 0,
        "Employee.Notes": 0,
        "Employee.ReportsTo": 0,
        "Employee.PhotoPath": 0
    }
},


// Dates
{
    $addFields: {
        Dates: {
            OrderDate: "$OrderDate",
            RequiredDate: "$RequiredDate"
        }
    },
},

// Orderdetails
{
    $lookup: {
        from: "orderdetails_tmp",
        localField: "OrderID",
        foreignField: "OrderID",
        as: "Orderdetails"
    }
},
{
    $project: {
        "Orderdetails._id": 0,
        "Orderdetails.OrderID": 0,
        "Orderdetails.ProductID": 0,
    }
},
{
    $addFields: {
        Orderdetails: {
            $map: {
                input: "$Orderdetails",
                as: "od",
                in: {
                    UnitPrice: "$$od.UnitPrice",
                    Quantity: "$$od.Quantity",
                    Discount: "$$od.Discount",
                    Value: {
                        $multiply: [
                            "$$od.UnitPrice",
                            "$$od.Quantity",
                            { $subtract: [1, "$$od.Discount"] }
                        ]
                    },
                    product: "$$od.product"
                }
            }
        }
    }
},


// OrderTotal
{
    $addFields: {
        OrderTotal: { $sum: "$Orderdetails.Value" }
    }
},


// Shipment
{
    $lookup: {
        from: "shippers",
        localField: "ShipVia",
        foreignField: "ShipperID",
        as: "Shipper"
    }
},
{
    $unwind: "$Shipper"
},
{
    $addFields: {
        Shipment: {
            Shipper: {
                ShipperID: "$Shipper.ShipperID",
                CompanyName: "$Shipper.CompanyName"
            },
            ShipName: "$ShipName",
            ShipAddress: "$ShipAddress",
            ShipCity: "$ShipCity",
            ShipCountry: "$ShipCountry"
        },
        Dates: {
            OrderDate: "$OrderDate",
            RequiredDate: "$RequiredDate"
        }
    },
},
{
    $project: {
        Shipper: 0
    }
},


{
    $project: {
        CustomerID: 0,
        EmployeeID: 0,
        ShipVia: 0,
        OrderDate: 0,
        RequiredDate: 0,
        ShipAddress: 0,
        ShipCity: 0,
        ShipCountry: 0,
        ShipName: 0,
        ShipPostalCode: 0,
        ShipRegion: 0,
        ShippedDate: 0
    }
},
{
    $sort: {
        OrderID: 1
    }
},
{
    $out: "OrderInfo"
}
)

db.orderdetails_tmp.drop()
