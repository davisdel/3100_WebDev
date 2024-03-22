const express = require('express');
const cors = require('cors');

const HTTP_PORT = 8080;
console.log("Listening on port " + HTTP_PORT);
var app = express();
app.use(cors());

var arrFruit = [];
let objBanana = {name:'banana', color:'yellow'};
let objGrape = {name:'grape', color:'purple'};
let objApple = {name:'apple', color:'red'};
arrFruit.push(objBanana);
arrFruit.push(objApple);
arrFruit.push(objGrape);

app.get("/", (req,res,next) => {

    let strFruit = req.query.fruit;
    console.log("Routed to base route");
    console.log(strFruit);
    arrFruit.forEach(function(thisfruit){
        if(thisfruit.name == strFruit){
            res.status(200).send(thisfruit);
        }
    })

    res.status(200).send('{"message":"Fruit not found"}');

});

app.get("/hello", (req,res,next) => {

    let strFruit = req.query.fruit;
    console.log("Routed to hello route");
    console.log(strFruit);

    res.status(200).send("Hello " + strFruit);

});

app.listen(HTTP_PORT);
