const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
})
//app.use(require("cors")); // (méthode alternative)

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectId;
const url = "mongodb://localhost:27017";

MongoClient.connect(url, {useNewUrlParser: true}, (err, client) => {

    let db = client.db("E-Commerce");

    /* Liste des produits */
    app.get("/loadProductsStore", (req,res) => {
        try {
            db.collection("produits").find().toArray((err, documents) => {
                res.end(JSON.stringify(documents));
            });
        } catch(e) {
            console.log("Erreur sur /produits : " +e);
            res.end(JSON.stringify([]));
        }
    });

    app.post("/loadProductsCart", (req,res) => {
        try {
            db.collection("panier").find(req.body).toArray((err, documents) => {
                res.end(JSON.stringify(documents));
            });
        } catch(e) {
            console.log("Erreur sur /produits : " +e);
            res.end(JSON.stringify([]));
        }
    });

    app.post("/verifyProduct", (requete,response) => {
        try {
            db.collection("panier").find(requete.body).toArray((err, documents) => {
                if (documents.length == 1)
                    response.end(JSON.stringify({"resultat": 1, "message":"Product exist"}));
                else
                    response.end(JSON.stringify({"resultat": 0, "message":"Product not exist"}));
        });
        } catch(e) {
            response.end(JSON.stringify({"resultat": 0, "message":e}));
        }
    });

    app.post("/updateProduct", (requete,response) => {
        try {
            db.collection("panier").update(requete.body, {$inc:{quantite:1}}).toArray((err, documents) => {
        });
        } catch(e) {
            response.end(JSON.stringify({"resultat": 0, "message":e}));
        }
    });

    app.post("/descQuantityProduct", (requete,response) => {
        try {
            db.collection("panier").update(requete.body, {$inc:{quantite:-1}}).toArray((err, documents) => {
        });
        } catch(e) {
            response.end(JSON.stringify({"resultat": 0, "message":e}));
        }
    });
    
    app.post("/addProduct",function (req, res) {
        try{
            db.collection("panier").insertOne(req.body,function (err, docs) {
                if (err)	
                res.send(err);
                else
                    res.send('Inscription Success');
        });
        } catch(e){
            console.log("Erreur sur /inscription/"+e);
            res.end(JSON.stringifly([]));
        }
    });

    app.post("/removeProduct",function (req, res) {
        try{
            db.collection("panier").remove(req.body,function (err, docs) {
                if (err)	
                res.send(err);
                else
                    res.send('Inscription Success');
        });
        } catch(e){
            console.log("Erreur sur /inscription/"+e);
            res.end(JSON.stringifly([]));
        }
    });

    /* Connexion */
    app.post("/inscription",function (req, res) {
        try{
            db.collection("membres").insertOne(req.body,function (err, docs) {
                if (err)	
                res.send(err);
                else
                    res.send('Inscription Success');
        });
        } catch(e){
            console.log("Erreur sur /inscription/"+e);
            res.end(JSON.stringifly([]));
        }
    });
    
    app.post("/verifyEmailAndConnection", (requete,response) => {
        try {
            db.collection("membres").find(requete.body).toArray((err, documents) => {
                console.log(documents);
                if (documents.length == 1)
                    response.end(JSON.stringify({"resultat": 1, "message":"Email or connection exist", "name" : documents[0].name}));
                else
                    response.end(JSON.stringify({"resultat": 0, "message":"Email or connection not exist"}));
        });
        } catch(e) {
            response.end(JSON.stringify({"resultat": 0, "message":e}));
        }
    });
});

app.listen(8888);