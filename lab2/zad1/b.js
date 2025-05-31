db.customers.aggregate([
{
    $lookup: {
        from: "OrderInfo",
        localField: "CustomerID",
        foreignField: "Customer.CustomerID",
        as: "Orders"
    }
},
{
    $project: {
        CustomerID: 1,
        CompanyName: 1,
        City: 1,
        Country: 1,
        Orders: 1
    }
},
{
    $project: {
        "Orders.Customer": 0
    }
},
{
    $sort: {
        CustomerID: 1
    }
},
{
    $out: "CustomerInfo"
}
])
