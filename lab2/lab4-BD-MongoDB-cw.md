# Dokumentowe bazy danych – MongoDB

Ćwiczenie/zadanie


---

**Imiona i nazwiska autorów:**

--- 

Odtwórz z backupu bazę north0

```
mongorestore --nsInclude='north0.*' ./dump/
```

```
use north0
```


# Zadanie 1 - operacje wyszukiwania danych,  przetwarzanie dokumentów

# a)

stwórz kolekcję  `OrdersInfo`  zawierającą następujące dane o zamówieniach
- pojedynczy dokument opisuje jedno zamówienie

```js
[  
  {  
    "_id": ...
    
    OrderID": ... numer zamówienia
    
    "Customer": {  ... podstawowe informacje o kliencie skladającym  
      "CustomerID": ... identyfikator klienta
      "CompanyName": ... nazwa klienta
      "City": ... miasto 
      "Country": ... kraj 
    },  
    
    "Employee": {  ... podstawowe informacje o pracowniku obsługującym zamówienie
      "EmployeeID": ... idntyfikator pracownika 
      "FirstName": ... imie   
      "LastName": ... nazwisko
      "Title": ... stanowisko  
     
    },  
    
    "Dates": {
       "OrderDate": ... data złożenia zamówienia
       "RequiredDate": data wymaganej realizacji
    }

    "Orderdetails": [  ... pozycje/szczegóły zamówienia - tablica takich pozycji 
      {  
        "UnitPrice": ... cena
        "Quantity": ... liczba sprzedanych jednostek towaru
        "Discount": ... zniżka  
        "Value": ... wartośc pozycji zamówienia
        "product": { ... podstawowe informacje o produkcie 
          "ProductID": ... identyfikator produktu  
          "ProductName": ... nazwa produktu 
          "QuantityPerUnit": ... opis/opakowannie
          "CategoryID": ... identyfikator kategorii do której należy produkt
          "CategoryName" ... nazwę tej kategorii
        },  
      },  
      ...   
    ],  

    "Freight": ... opłata za przesyłkę
    "OrderTotal"  ... sumaryczna wartosc sprzedanych produktów

    "Shipment" : {  ... informacja o wysyłce
        "Shipper": { ... podstawowe inf o przewoźniku 
           "ShipperID":  
            "CompanyName":
        }  
        ... inf o odbiorcy przesyłki
        "ShipName": ...
        "ShipAddress": ...
        "ShipCity": ... 
        "ShipCountry": ...
    } 
  } 
]  
```


# b)

stwórz kolekcję  `CustomerInfo`  zawierającą następujące dane kazdym klencie
- pojedynczy dokument opisuje jednego klienta

```js
[  
  {  
    "_id": ...
    
    "CustomerID": ... identyfikator klienta
    "CompanyName": ... nazwa klienta
    "City": ... miasto 
    "Country": ... kraj 

	"Orders": [ ... tablica zamówień klienta o strukturze takiej jak w punkcie a) (oczywiście bez informacji o kliencie)
	  
	]

		  
]  
```

# c) 

Napisz polecenie/zapytanie: Dla każdego klienta pokaż wartość zakupionych przez niego produktów z kategorii 'Confections'  w 1997r
- Spróbuj napisać to zapytanie wykorzystując
	- oryginalne kolekcje (`customers, orders, orderdertails, products, categories`)
	- kolekcję `OrderInfo`
	- kolekcję `CustomerInfo`

- porównaj zapytania/polecenia/wyniki

```js
[  
  {  
    "_id": 
    
    "CustomerID": ... identyfikator klienta
    "CompanyName": ... nazwa klienta
	"ConfectionsSale97": ... wartość zakupionych przez niego produktów z kategorii 'Confections'  w 1997r

  }		  
]  
```

# d)

Napisz polecenie/zapytanie:  Dla każdego klienta poaje wartość sprzedaży z podziałem na lata i miesiące
Spróbuj napisać to zapytanie wykorzystując
	- oryginalne kolekcje (`customers, orders, orderdertails, products, categories`)
	- kolekcję `OrderInfo`
	- kolekcję `CustomerInfo`

- porównaj zapytania/polecenia/wyniki

```js
[  
  {  
    "_id": 
    
    "CustomerID": ... identyfikator klienta
    "CompanyName": ... nazwa klienta

	"Sale": [ ... tablica zawierająca inf o sprzedazy
	    {
            "Year":  ....
            "Month": ....
            "Total": ...	    
	    }
	    ...
	]
  }		  
]  
```

# e)

Załóżmy że pojawia się nowe zamówienie dla klienta 'ALFKI',  zawierające dwa produkty 'Chai' oraz "Ikura"
- pozostałe pola w zamówieniu (ceny, liczby sztuk prod, inf o przewoźniku itp. możesz uzupełnić wg własnego uznania)
Napisz polecenie które dodaje takie zamówienie do bazy
- aktualizując oryginalne kolekcje `orders`, `orderdetails`
- aktualizując kolekcję `OrderInfo`
- aktualizując kolekcję `CustomerInfo`

Napisz polecenie 
- aktualizując oryginalną kolekcję orderdetails`
- aktualizując kolekcję `OrderInfo`
- aktualizując kolekcję `CustomerInfo`

# f)

Napisz polecenie które modyfikuje zamówienie dodane w pkt e)  zwiększając zniżkę  o 5% (dla każdej pozycji tego zamówienia) 

Napisz polecenie 
- aktualizując oryginalną kolekcję `orderdetails`
- aktualizując kolekcję `OrderInfo`
- aktualizując kolekcję `CustomerInfo`



UWAGA:
W raporcie należy zamieścić kod poleceń oraz uzyskany rezultat, np wynik  polecenia `db.kolekcka.fimd().limit(2)` lub jego fragment


## Zadanie 1  - rozwiązanie

> Wyniki: 
> 
> przykłady, kod, zrzuty ekranów, komentarz ...

a)

Do stworzenia kolekcji użyłem tabeli pomocniczej orderdetails_tmp, którą później usunąłem

orderdetails_tmp:
```js
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
```

OrderInfo:
```js
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
```


Wynik polecenia `db.OrderInfo.find().limit(2)`:
```js
[
  {
    "_id": {"$oid": "63a060b9bb3b972d6f4e1fc6"},
    "Customer": {
      "CustomerID": "VINET",
      "CompanyName": "Vins et alcools Chevalier",
      "City": "Reims",
      "Country": "France"
    },
    "Dates": {
      "OrderDate": {"$date": "1996-07-04T00:00:00.000Z"},
      "RequiredDate": {"$date": "1996-08-01T00:00:00.000Z"}
    },
    "Employee": {
      "EmployeeID": 5,
      "LastName": "Buchanan",
      "FirstName": "Steven",
      "Title": "Sales Manager"
    },
    "Freight": 32.38,
    "OrderID": 10248,
    "OrderTotal": 440,
    "Orderdetails": [
      {
        "UnitPrice": 14,
        "Quantity": 12,
        "Discount": 0,
        "Value": 168,
        "product": {
          "ProductID": 11,
          "ProductName": "Queso Cabrales",
          "CategoryID": 4,
          "QuantityPerUnit": "1 kg pkg.",
          "CategoryName": "Dairy Products"
        }
      },
      {
        "UnitPrice": 9.8,
        "Quantity": 10,
        "Discount": 0,
        "Value": 98,
        "product": {
          "ProductID": 42,
          "ProductName": "Singaporean Hokkien Fried Mee",
          "CategoryID": 5,
          "QuantityPerUnit": "32 - 1 kg pkgs.",
          "CategoryName": "Grains/Cereals"
        }
      },
      {
        "UnitPrice": 34.8,
        "Quantity": 5,
        "Discount": 0,
        "Value": 174,
        "product": {
          "ProductID": 72,
          "ProductName": "Mozzarella di Giovanni",
          "CategoryID": 4,
          "QuantityPerUnit": "24 - 200 g pkgs.",
          "CategoryName": "Dairy Products"
        }
      }
    ],
    "Shipment": {
      "Shipper": {
        "ShipperID": 3,
        "CompanyName": "Federal Shipping"
      },
      "ShipName": "Vins et alcools Chevalier",
      "ShipAddress": "59 rue de l'Abbaye",
      "ShipCity": "Reims",
      "ShipCountry": "France"
    }
  },
  {
    "_id": {"$oid": "63a060b9bb3b972d6f4e1fc7"},
    "Customer": {
      "CustomerID": "TOMSP",
      "CompanyName": "Toms Spezialitäten",
      "City": "Münster",
      "Country": "Germany"
    },
    "Dates": {
      "OrderDate": {"$date": "1996-07-05T00:00:00.000Z"},
      "RequiredDate": {"$date": "1996-08-16T00:00:00.000Z"}
    },
    "Employee": {
      "EmployeeID": 6,
      "LastName": "Suyama",
      "FirstName": "Michael",
      "Title": "Sales Representative"
    },
    "Freight": 11.61,
    "OrderID": 10249,
    "OrderTotal": 1863.4,
    "Orderdetails": [
      {
        "UnitPrice": 18.6,
        "Quantity": 9,
        "Discount": 0,
        "Value": 167.4,
        "product": {
          "ProductID": 14,
          "ProductName": "Tofu",
          "CategoryID": 7,
          "QuantityPerUnit": "40 - 100 g pkgs.",
          "CategoryName": "Produce"
        }
      },
      {
        "UnitPrice": 42.4,
        "Quantity": 40,
        "Discount": 0,
        "Value": 1696,
        "product": {
          "ProductID": 51,
          "ProductName": "Manjimup Dried Apples",
          "CategoryID": 7,
          "QuantityPerUnit": "50 - 300 g pkgs.",
          "CategoryName": "Produce"
        }
      }
    ],
    "Shipment": {
      "Shipper": {
        "ShipperID": 1,
        "CompanyName": "Speedy Express"
      },
      "ShipName": "Toms Spezialitäten",
      "ShipAddress": "Luisenstr. 48",
      "ShipCity": "Münster",
      "ShipCountry": "Germany"
    }
  }
]
```

b)

CustomerInfo:
```js
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
```

Wynik polecenia `db.CustomerInfo.find().limit(2)`, ale usunąłem zamówienia oprócz pierwszego bo wynik był bardzo długi
```js
[
  {
    "_id": {"$oid": "63a05cdfbb3b972d6f4e097b"},
    "City": "Berlin",
    "CompanyName": "Alfreds Futterkiste",
    "Country": "Germany",
    "CustomerID": "ALFKI",
    "Orders": [
      {
        "_id": {"$oid": "63a060b9bb3b972d6f4e2151"},
        "OrderID": 10643,
        "Freight": 29.46,
        "Employee": {
          "EmployeeID": 6,
          "LastName": "Suyama",
          "FirstName": "Michael",
          "Title": "Sales Representative"
        },
        "Dates": {
          "OrderDate": {"$date": "1997-08-25T00:00:00.000Z"},
          "RequiredDate": {"$date": "1997-09-22T00:00:00.000Z"}
        },
        "Orderdetails": [
          {
            "UnitPrice": 45.6,
            "Quantity": 15,
            "Discount": 0.25,
            "Value": 513,
            "product": {
              "ProductID": 28,
              "ProductName": "Rössle Sauerkraut",
              "CategoryID": 7,
              "QuantityPerUnit": "25 - 825 g cans",
              "CategoryName": "Produce"
            }
          },
          {
            "UnitPrice": 18,
            "Quantity": 21,
            "Discount": 0.25,
            "Value": 283.5,
            "product": {
              "ProductID": 39,
              "ProductName": "Chartreuse verte",
              "CategoryID": 1,
              "QuantityPerUnit": "750 cc per bottle",
              "CategoryName": "Beverages"
            }
          },
          {
            "UnitPrice": 12,
            "Quantity": 2,
            "Discount": 0.25,
            "Value": 18,
            "product": {
              "ProductID": 46,
              "ProductName": "Spegesild",
              "CategoryID": 8,
              "QuantityPerUnit": "4 - 450 g glasses",
              "CategoryName": "Seafood"
            }
          }
        ],
        "OrderTotal": 814.5,
        "Shipment": {
          "Shipper": {
            "ShipperID": 1,
            "CompanyName": "Speedy Express"
          },
          "ShipName": "Alfreds Futterkiste",
          "ShipAddress": "Obere Str. 57",
          "ShipCity": "Berlin",
          "ShipCountry": "Germany"
        }
      },
      ... więcej zamówień ...
    ]
  },
  {
    "_id": {"$oid": "63a05cdfbb3b972d6f4e097c"},
    "City": "México D.F.",
    "CompanyName": "Ana Trujillo Emparedados y helados",
    "Country": "Mexico",
    "CustomerID": "ANATR",
    "Orders": [
      {
        "_id": {"$oid": "63a060b9bb3b972d6f4e2002"},
        "OrderID": 10308,
        "Freight": 1.61,
        "Employee": {
          "EmployeeID": 7,
          "LastName": "King",
          "FirstName": "Robert",
          "Title": "Sales Representative"
        },
        "Dates": {
          "OrderDate": {"$date": "1996-09-18T00:00:00.000Z"},
          "RequiredDate": {"$date": "1996-10-16T00:00:00.000Z"}
        },
        "Orderdetails": [
          {
            "UnitPrice": 28.8,
            "Quantity": 1,
            "Discount": 0,
            "Value": 28.8,
            "product": {
              "ProductID": 69,
              "ProductName": "Gudbrandsdalsost",
              "CategoryID": 4,
              "QuantityPerUnit": "10 kg pkg.",
              "CategoryName": "Dairy Products"
            }
          },
          {
            "UnitPrice": 12,
            "Quantity": 5,
            "Discount": 0,
            "Value": 60,
            "product": {
              "ProductID": 70,
              "ProductName": "Outback Lager",
              "CategoryID": 1,
              "QuantityPerUnit": "24 - 355 ml bottles",
              "CategoryName": "Beverages"
            }
          }
        ],
        "OrderTotal": 88.8,
        "Shipment": {
          "Shipper": {
            "ShipperID": 3,
            "CompanyName": "Federal Shipping"
          },
          "ShipName": "Ana Trujillo Emparedados y helados",
          "ShipAddress": "Avda. de la Constitución 2222",
          "ShipCity": "México D.F.",
          "ShipCountry": "Mexico"
        }
      },
      ... więcej zamówień ...
    ]
  }
]
```

c)

Oryginalne kolekcje:
```js
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
```

OrderInfo:
```js 
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
```

CustomerInfo:
```js 
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
```

Wynik zapytania jest taki sam dla wszystkich zapytań (tutaj wkleiłem pierwsze 5 z 20 pozycji):
```js 
[
  {
    "_id": "QUICK",
    "CompanyName": "QUICK-Stop",
    "ConfectionsSale97": 11648.599999657274
  },
  {
    "_id": "ERNSH",
    "CompanyName": "Ernst Handel",
    "ConfectionsSale97": 9829.757463981212
  },
  {
    "_id": "SAVEA",
    "CompanyName": "Save-a-lot Markets",
    "ConfectionsSale97": 6351.084993118047
  },
  {
    "_id": "OLDWO",
    "CompanyName": "Old World Delicatessen",
    "ConfectionsSale97": 2758.375
  },
  {
    "_id": "RATTC",
    "CompanyName": "Rattlesnake Canyon Grocery",
    "ConfectionsSale97": 2562.5
  },
  ... jeszcze 15 pozycji ...
]
```

To zapytanie jest stosunkowo proste na kolekcjach `OrderInfo` i `CustomerInfo`, ale skomplikowane na oryginalnych kolekcjach 
ze względu na konieczność używania `$lookup` i brak redundantnego pola `Value`.


d)

Oryginalne kolekcje:
```js 
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
```

OrderInfo:
```js 
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
```

CustomerInfo:
```js
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
```

Wynik jest taki sam dla wszystkich zapytań (tutaj pierwsze 3 z 24 pozycji):
```js 
[
  {
    "CompanyName": "Alfreds Futterkiste",
    "CustomerID": "ALFKI",
    "Sales": [
      {
        "Year": 1997,
        "Month": 8,
        "Total": 814.5
      },
      {
        "Year": 1997,
        "Month": 10,
        "Total": 1208
      },
      {
        "Year": 1998,
        "Month": 1,
        "Total": 845.799999922514
      },
      {
        "Year": 1998,
        "Month": 3,
        "Total": 471.19999970197676
      },
      {
        "Year": 1998,
        "Month": 4,
        "Total": 933.4999996051192
      }
    ]
  },
  {
    "CompanyName": "Ana Trujillo Emparedados y helados",
    "CustomerID": "ANATR",
    "Sales": [
      {
        "Year": 1996,
        "Month": 9,
        "Total": 88.8
      },
      {
        "Year": 1997,
        "Month": 8,
        "Total": 479.75
      },
      {
        "Year": 1997,
        "Month": 11,
        "Total": 320
      },
      {
        "Year": 1998,
        "Month": 3,
        "Total": 514.4
      }
    ]
  },
  ... jeszcze 21 pozycji ...
]
```


Podobnie jak w poprzednim zadanie zapytanie jest stosunkowo proste na kolekcjach `OrderInfo` i `CustomerInfo`, ale skomplikowane
na oryginalnych kolekcjach ze względu na konieczność używanie `$lookup` i brak redundantnych pól `Value` i `OrderTotal`.


e)


Oryginalne kolekcje: 
```js 
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
```

OrderInfo:
```js 
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
```

CustomerInfo:
```js
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
```

....

# Zadanie 2 - modelowanie danych


Zaproponuj strukturę bazy danych dla wybranego/przykładowego zagadnienia/problemu

Należy wybrać jedno zagadnienie/problem (A lub B lub C)

Przykład A
- Wykładowcy, przedmioty, studenci, oceny
	- Wykładowcy prowadzą zajęcia z poszczególnych przedmiotów
	- Studenci uczęszczają na zajęcia
	- Wykładowcy wystawiają oceny studentom
	- Studenci oceniają zajęcia

Przykład B
- Firmy, wycieczki, osoby
	- Firmy organizują wycieczki
	- Osoby rezerwują miejsca/wykupują bilety
	- Osoby oceniają wycieczki

Przykład C
- Własny przykład o podobnym stopniu złożoności

a) Zaproponuj  różne warianty struktury bazy danych i dokumentów w poszczególnych kolekcjach oraz przeprowadzić dyskusję każdego wariantu (wskazać wady i zalety każdego z wariantów)
- zdefiniuj schemat/reguły walidacji danych
- wykorzystaj referencje
- dokumenty zagnieżdżone
- tablice

b) Kolekcje należy wypełnić przykładowymi danymi

c) W kontekście zaprezentowania wad/zalet należy zaprezentować kilka przykładów/zapytań/operacji oraz dla których dedykowany jest dany wariant

W sprawozdaniu należy zamieścić przykładowe dokumenty w formacie JSON ( pkt a) i b)), oraz kod zapytań/operacji (pkt c)), wraz z odpowiednim komentarzem opisującym strukturę dokumentów oraz polecenia ilustrujące wykonanie przykładowych operacji na danych

Do sprawozdania należy kompletny zrzut wykonanych/przygotowanych baz danych (taki zrzut można wykonać np. za pomocą poleceń `mongoexport`, `mongdump` …) oraz plik z kodem operacji/zapytań w wersji źródłowej (np. plik .js, np. plik .md ), załącznik powinien mieć format zip

## Zadanie 2  - rozwiązanie

> Wyniki: 
> 
> przykłady, kod, zrzuty ekranów, komentarz ...

```js
--  ...
```

---

Punktacja:

|         |     |
| ------- | --- |
| zadanie | pkt |
| 1       | 1   |
| 2       | 1   |
| razem   | 2   |



