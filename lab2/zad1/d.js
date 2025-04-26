db.CustomerInfo.aggregate([
{
    $unwind: "$Orders"
},
{
    $addFields: {
        Year: { $year: "$Orders.Dates.OrderDate" },
        Month: { $month: "$Orders.Dates.OrderDate" }
    }
},

{
    $group: {
        _id: {
            CustomerID: "$CustomerID",
            Year: "$Year",
            Month: "$Month"
        },
        CustomerID: { $first: "$CustomerID" },
        CompanyName: { $first: "$CompanyName" },
        Year: { $first: "$Year" },
        Month: { $first: "$Month" },
        Total: { $sum: "$Orders.OrderTotal" }
    }
},
{
    $sort: {
        Year: 1,
        Month: 1
    }
},
{
    $group: {
        _id: "$CustomerID",
        CustomerID: { $first: "$CustomerID" },
        CompanyName: { $first: "$CompanyName" },
        Sales: {
            $push: {
                Year: "$Year",
                Month: "$Month",
                Total: "$Total"
            }
        }
    }
},
{
    $project: {
        _id: 0,
        CustomerID: 1,
        CompanyName: 1,
        Sales: 1
    }
},
{
    $sort: {
        CustomerID: 1
    }
}
])


db.OrderInfo.aggregate([
{
    $addFields: {
        Year: { $year: "$Dates.OrderDate" },
        Month: { $month: "$Dates.OrderDate" }
    }
},

{
    $group: {
        _id: {
            CustomerID: "$Customer.CustomerID",
            Year: "$Year",
            Month: "$Month"
        },
        CustomerID: { $first: "$Customer.CustomerID" },
        CompanyName: { $first: "$Customer.CompanyName" },
        Year: { $first: "$Year" },
        Month: { $first: "$Month" },
        Total: { $sum: "$OrderTotal" }
    }
},
{
    $sort: {
        Year: 1,
        Month: 1
    }
},
{
    $group: {
        _id: "$CustomerID",
        CustomerID: { $first: "$CustomerID" },
        CompanyName: { $first: "$CompanyName" },
        Sales: {
            $push: {
                Year: "$Year",
                Month: "$Month",
                Total: "$Total"
            }
        }
    }
},
{
    $project: {
        _id: 0,
        CustomerID: 1,
        CompanyName: 1,
        Sales: 1
    }
},
{
    $sort: {
        CustomerID: 1
    }
}
])


db.orders.aggregate([
{
    $addFields: {
        Year: { $year: "$OrderDate" },
        Month: { $month: "$OrderDate" }
    }
},


{
    $lookup: {
        from: "orderdetails",
        localField: "OrderID",
        foreignField: "OrderID",
        as: "Orderdetails"
    }
},
{
    $unwind: "$Orderdetails"
},


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
    $addFields: {
        Value: {
            $multiply: [
                "$Orderdetails.UnitPrice",
                "$Orderdetails.Quantity",
                { $subtract: [1, "$Orderdetails.Discount"] }
            ]
        },
    }
},

{
    $group: {
        _id: {
            CustomerID: "$CustomerID",
            Year: "$Year",
            Month: "$Month"
        },
        CustomerID: { $first: "$CustomerID" },
        CompanyName: { $first: "$Customer.CompanyName" },
        Year: { $first: "$Year" },
        Month: { $first: "$Month" },
        Total: { $sum: "$Value" }
    }
},
{
    $sort: {
        Year: 1,
        Month: 1
    }
},
{
    $group: {
        _id: "$CustomerID",
        CustomerID: { $first: "$CustomerID" },
        CompanyName: { $first: "$CompanyName" },
        Sales: {
            $push: {
                Year: "$Year",
                Month: "$Month",
                Total: "$Total"
            }
        }
    }
},
{
    $project: {
        _id: 0,
        CustomerID: 1,
        CompanyName: 1,
        Sales: 1
    }
},
{
    $sort: {
        CustomerID: 1
    }
}
])
