const express = require('express');
const cors = require('cors');

const HTTP_PORT = 8080;
console.log("Listening on port " + HTTP_PORT);
var app = express();
app.use(cors());

class Fruit {

    constructor(strName, strColor){
        this.name = strName;
        this.color = strColor;
    }

}

var arrFruit = [];
let objBanana = new Fruit('banana', 'yellow');
let objGrape = new Fruit('apple','red');
let objApple = new Fruit('grape', 'purple');
arrFruit.push(objBanana);
arrFruit.push(objApple);
arrFruit.push(objGrape);
arrFruit.push(new Fruit('kiwi', 'brown'));

app.get("/", (req,res,next) => {

    res.status(200).send(arrFruit);

});

app.get("/hello", (req,res,next) => {

    let strFruit = req.query.fruit;
    console.log("Routed to hello route");
    console.log(strFruit);

    res.status(200).send("Hello " + strFruit);

});

app.post("/fruit", (req,res,next) => {

    let strName = req.query.name;
    let strColor = req.query.color;

    arrFruit.push(new Fruit(strName, strColor));

    res.json({'status':200,"message":arrFruit})

});

app.get("/fruit", (req,res,next) => {
    
    let strName = req.query.name;
    if(strName){
        arrFruit.forEach(function(fruit){
            if(fruit.name == strName){
                res.json({"status":200,"message":fruit});
            }
        })
        res.json({"status":200,"message":"Fruit not found"});
    } else {
        res.json({"status":200,"message":arrFruit});
    }

});

app.delete("/fruit", (req,res,next) => {
    
    let strName = req.query.name;
    if(strName){
        arrFruit.forEach(function(fruit,index){
            if(fruit.name == strName){
                arrFruit.splice(index,1);
                res.json({"status":200,"message":fruit});
            }
        })
        res.json({"status":200,"message":"Fruit not found"});
    } else {
        arrFruit = [];
        res.json({"status":200,"message":arrFruit});
    }

});

app.listen(HTTP_PORT);
