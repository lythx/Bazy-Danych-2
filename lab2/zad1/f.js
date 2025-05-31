db.orderdetails.updateMany(
{
    OrderID: 20000
},
{
    $inc: {
        Discount: 0.05
    }
})

db.OrderInfo.updateOne(
{
    OrderID: 20000
},
[
{
    $set: {
        Orderdetails: {
            $map: {
                input: "$Orderdetails",
                as: "od",
                in: {
                    UnitPrice: "$$od.UnitPrice",
                    Quantity: "$$od.Quantity",
                    Discount: { $add: ["$$od.Discount", 0.05] },
                    Value: {
                        $multiply: [
                            "$$od.UnitPrice",
                            "$$od.Quantity",
                            { $subtract: [1, { $add: ["$$od.Discount", 0.05] }] }
                        ]
                    },
                    product: "$$od.product"
                }
            }
        }
    }
},
{
    $set: {
        OrderTotal: { $sum: "$Orderdetails.Value" }
    }
}
]
)


db.CustomerInfo.updateOne(
{
    CustomerID: "ALFKI"
},
[
{
    $set: {
        Orders: {
            $map: {
                input: "$Orders",
                as: "order",
                in: {
                    Customer: "$$order.Customer",
                    Dates: "$$order.Dates",
                    Employee: "$$order.Employee",
                    Freight: "$$order.Freight",
                    OrderID: "$$order.OrderID",
                    Shipment: "$$order.Shipment",
                    OrderTotal: "$$order.OrderTotal",
                    Orderdetails: {
                        $cond: {
                             if: { $eq: ["$$order.OrderID", 20000] },
                             then: {
                                $map: {
                                    input: "$$order.Orderdetails",
                                    as: "od",
                                    in: {
                                        UnitPrice: "$$od.UnitPrice",
                                        Quantity: "$$od.Quantity",
                                        Discount: { $add: ["$$od.Discount", 0.05] },
                                        Value: {
                                            $multiply: [
                                                "$$od.UnitPrice",
                                                "$$od.Quantity",
                                                { $subtract: [1, { $add: ["$$od.Discount", 0.05] }] }
                                            ]
                                        },
                                        product: "$$od.product"
                                    }
                                }
                             },
                             else: "$$order.Orderdetails"
                        }
                    }
                }
            }
        }
    }
},
{
    $set: {
        Orders: {
            $map: {
                input: "$Orders",
                as: "order",
                in: {
                    Customer: "$$order.Customer",
                    Dates: "$$order.Dates",
                    Employee: "$$order.Employee",
                    Freight: "$$order.Freight",
                    OrderID: "$$order.OrderID",
                    Shipment: "$$order.Shipment",
                    Orderdetails: "$$order.Orderdetails",
                    OrderTotal: { $sum: "$$order.Orderdetails.Value" }
                }
            }
        }
    }
}
]
)