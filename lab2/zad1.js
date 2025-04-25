use north0;

db.orderdetails_tmp.find()

db.orders.aggregate(
//customers
{
    $lookup : {
        from: "customers",
        localField: "CustomerID",
        foreignField: "CustomerID",
        as: "Customer"
    }

},
{
    $unwind : "$Customer"
},
{
    $project : {
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

//employees
{
    $lookup : {
        from: "employees",
            localField: "EmployeeID",
            foreignField: "EmployeeID",
            as: "Employee"
    }
},
{
    $unwind : "$Employee"
},
{
    $project : {
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
//shippers
{
    $lookup : {
        from: "shippers",
        localField: "ShipVia",
        foreignField: "ShipperID",
        as: "Shipper"
    }
},
{
    $unwind : "$Shipper"
},
{
    $project : {
        "Shipper._id": 0,
        "Shipper.Phone": 0

    }
},
//orderdetails
{
    $lookup : {
        from: "orderdetails_tmp",
        localField: "OrderID",
        foreignField: "OrderID",
        as: "Orderdetails"
    }
},
{
    $project : {
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
{
    $project : {
        "CustomerID": 0,
        "EmployeeID": 0,
        "ShipVia": 0,
        "OrderDate": 0
    }
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
    $addFields: {
        OrderTotal: { $sum: "$Orderdetails.Value" }
    }
},
{
$out : "orders_tmp"
}

)


db.orderdetails.aggregate(
{
    $lookup : {
        from: "products",
        localField: "ProductID",
        foreignField: "ProductID",
        as: "product"
    }

},
{
    $unwind : "$product"
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
$out : "orderdetails_tmp"
})

db.orderdetails_tmp.drop()

db.customers.aggregate(
{
    $lookup: {
        from: "orders_tmp",
        localField: "CustomerID",
        foreignField: "Customer.CustomerID",
        as: "Orders"
    }
},
{
    $project: {
        "Orders.Customer": 0
    }
},
{
$out : "CustomerInfo"
}
)