db.CustomerInfo.aggregate([
{
    $unwind: "$Orders"
},
{
    $match: {
        $expr: {
            $eq: [
                { $year: "$Orders.Dates.OrderDate" },
                1997
            ]
      }
    }
},


{
    $unwind: "$Orders.Orderdetails"
},
{
    $match: {
        "Orders.Orderdetails.product.CategoryName": "Confections"
    }
},


{
    $group: {
        _id: "$CustomerID",
        CompanyName: { $first: "$CompanyName" },
        ConfectionsSale97: { $sum: "$Orders.Orderdetails.Value" }
    }
},
{
    $project: {
        _id: 1,
        CompanyName: 1,
        ConfectionsSale97: 1
    }
},
{
    $sort: {
        ConfectionsSale97: -1
    }
}
])


db.OrderInfo.aggregate([
{
    $match: {
        $expr: {
            $eq: [
                { $year: "$Dates.OrderDate" },
                1997
            ]
        }
    }
},


{
    $unwind: "$Orderdetails"
},
{
    $match: {
        "Orderdetails.product.CategoryName": "Confections"
    }
},


{
    $group: {
        _id: "$Customer.CustomerID",
        CompanyName: { $first: "$Customer.CompanyName" },
        ConfectionsSale97: { $sum: "$Orderdetails.Value" }
    }
},
{
    $project: {
        _id: 1,
        CompanyName: 1,
        ConfectionsSale97: 1
    }
},
{
    $sort: {
        ConfectionsSale97: -1
    }
}
])

db.orders.aggregate([
{
    $match: {
        $expr: {
            $eq: [
                { $year: "$OrderDate" },
                1997
            ]
        }
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
        from: "products",
        localField: "Orderdetails.ProductID",
        foreignField: "ProductID",
        as: "Product"
    }
},
{
    $unwind: "$Product"
},


{
    $lookup: {
        from: "categories",
        localField: "Product.CategoryID",
        foreignField: "CategoryID",
        as: "Category"
    }
},
{
    $unwind: "$Category"
},
{
    $match: {
        "Category.CategoryName": "Confections"
    }
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
        _id: "$CustomerID",
        CompanyName: { $first: "$Customer.CompanyName" },
        ConfectionsSale97: { $sum: "$Value" }
    }
},
{
    $project: {
        _id: 1,
        CompanyName: 1,
        ConfectionsSale97: 1
    }
},
{
    $sort: {
        ConfectionsSale97: -1
    }
}
])

//db.CustomerInfo.aggregate([
//{
//    $unwind: "$Orders"
//},
//{
//    $match: {
//        $expr: {
//            $eq: [
//                { $year: "$Orders.Dates.OrderDate" },
//                1997
//            ]
//      }
//    }
//},
//{
//    $addFields: {
//       ConfectionsValue: {
//            $reduce: {
//                input: "$Orders.Orderdetails",
//                initialValue: 0,
//                in: {
//                    $cond: {
//                        if: { $eq: ["$$this.product.CategoryName", "Confections"] },
//                        then: { $add: ["$$value" ,"$$this.Value"] },
//                        else: "$$value"
//                    }
//                }
//            }
//       }
//    }
//},
//{
//    $group: {
//        _id: "$CustomerID",
//        CompanyName: { $first: "$CompanyName" },
//        ConfectionsSale97: { $sum: "$ConfectionsValue" }
//    }
//},
//{
//    $project: {
//        _id: 1,
//        CompanyName: 1,
//        ConfectionsSale97: 1
//    }
//}
//])