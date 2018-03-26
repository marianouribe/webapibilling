
var express = require('express');
var app = express();
var bodyParse = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/swag-shop');

var Product = require('./model/product');
var WishList = require('./model/wishlist');

var sql = require('mssql');

//Allow all requests from all domains & localhost
app
    .all('/*', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        next();
    });


app.use(bodyParse.json());
app.use(bodyParse.urlencoded({extended:false}));

app.listen(3004, () => {
   console.log("Server started on port 3004");
});


//Setting up server
//   var server = app.listen(process.env.PORT || 3004, function () {
//      var port = server.address().port;
//      console.log("App now running on port", port);
//   });

//Initiallising connection string
    var dbConfig = {
        user:  'sa',
        password: '123',
        server: 'SERVER\\CLIENTES',
        database: 'WebBilling'
    };


//Function to connect to database and execute query
var  executeQuery = function(res, query){             

    // console.log(dbConfig);
    
    // console.log(dbConfig.server);
     sql.connect(dbConfig, function (err) {
        //  console.log(dbConfig.server);
        
         if (err) {   
                     console.log("Error while connecting database :- " + err);
                     res.send(err);
                  }
                  else {
                        // console.log(query);
                         // create Request object
                         var request = new sql.Request();
                         // query to the database
                         request.query(query, (err, registros) => {
                           if (err) {
                                      console.log("Error while querying database :- " + err);
                                      res.send(err);
                                     }
                                     else {
                                        console.log(registros);
                                        res.send(registros);
                                        sql.close();
                                            }
                               });
                       }
      });           
}

//GET API
app.get('/api/articulo', function(req , res){
                var query = "SELECT top 3 A.CodigoArticulo IdArticulo,A.Descripcion DescripcionArticulo,";
                    query += " A.CostoUnitario PrecioUnitarioArticulo, CONVERT(VARCHAR(MAX),B.FileData,1) Data FROM ";
                    query += " Tbl_MaestroArticulo A INNER JOIN Tbl_ImagenesArticulos B  "
                    query += " ON A.CodigoArticulo = B.CodigoArticulo ";
                executeQuery(res, query);
});


//POST API
 app.post('/api/usuario', function(req , res){
                var query = 'INSERT INTO [Tbl_usuarios] (Nombre,Email,Clave) VALUES (req.body.Nombre,req.body.Email,req.body.Clave)';
                executeQuery (res, query);
});

//PUT API
 app.put('/api/usuario/:Usuario_Id', function(req , res){
                var query = "UPDATE [Tbl_usuarios] SET Nombre= " + req.body.Nombre + " , Email=  " + req.body.Email + "  WHERE Usuario_Id= " + req.params.Usuario_Id;
                executeQuery (res, query);
});

// DELETE API
 app.delete('/api/usuario /:Usuario_Id', function(req , res){
                var query = "DELETE FROM [Tbl_usuarios] WHERE Usuario_Id=" + req.params.Usuario_Id;
                executeQuery (res, query);
});

/*
app.post('/product', (req, res) => {
    var product = new Product();
    product.title = req.body.title;
    product.price = req.body.price;
    //product.likes = 0; este comentario por que ya tiene un valor por defecto de 0
    product.save((err, savedProduct) => {
        if (err){
            res.status(500).send({error:"Coud not save product"});
        }else{
            //res.status(200).send(savedProduct); puede ser de las dos formas
            res.send(savedProduct);
        }
    });
});

app.get('/product', (req, res) => {
    //trabaja de manera asincrona
    //console.log(1);
    /// asi no debe ser porque esto debe trabajar de manera asincrona y puede enviar la variable prods Empty
    // var prods;
    // Product.find({},(err, products) => {
    //     //console.log(2);
    //     if (err){
    //         res.status(500).send({error:"Could not fetc products"})
    //     } else {
    //         prods = products;
    //         //res.send(products);
    //     }
    // });

    // res.send(prods);
    //console.log(3);

    //asi des es que debe ser
    Product.find({}, (err, products) => {
        if (err) {
            res.status(500).send({ error: "Could not fetch products" });
        } else {
            res.send(products);
        }
    });
});

app.get('/wishlist', (req, res) => {

    //Populating Data
    WishList.find({}).populate({path:'products', model: 'Product'}).exec((err,wishLists) => {
        if (err){
            res.status(500).send({error: "Could not fetch wishlists"});
        } else {
            res.status(200).send(wishLists);
        }
    })

    // // Funciona así
    // // WishList.find({},(err,wishLists) => {
    // //     if (err){
    // //         res.status(500).send({error:"Culd not fetch wishlist"})
    // //     } else {
    // //         res.send(wishLists);
    // //     }
    // // });
});

app.post('/wishlist', (req, res) => {
    var wishlist = new WishList();
    wishlist.title = req.body.title;

    wishlist.save((err, newWishList) => {
        if (err){
            res.status(500).send({error:"Could not create wishlist"});
        } else {
            res.send(newWishList);
        }
    });
});

app.put('/wishlist/product/add', (req, res) => {
    Product.findOne({_id: req.body.productId}, (err, product) => {
        if (err){
            res.status(500).send({error: "Could not add item to wishlist"});
        } else {
            WishList.update({_id:req.body.wishListId}, {$addToSet: {products: product._id}}, (err, wishList) =>{
                if (err){
                    res.status(500).send({ error: "Could not add item to wishlist" });
                } else {
                    //res.send(wishList); funcionan asi
                    res.send("Successfully add to wishlist");
                }
            });
        }
    });
});

*/