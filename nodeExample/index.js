const express = require('express');
const cors = require('cors');
const bcrypt = require("bcrypt");
const sqlite3 = require('sqlite3').verbose();
const dbSource = ("node.db");
const {v4:uuidv4} = require("uuid");

const db = new sqlite3.Database(dbSource);

const HTTP_PORT = 8080;
console.log("Listening on port " + HTTP_PORT);
console.log("Hosted at http://localhost:8080");
var app = express();
app.use(cors());

class Fruit {

    constructor(strName, strColor){
        this.name = strName;
        this.color = strColor;
    }

}

let strID = uuidv4();

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

    let strCommand = 'SELECT * FROM tblFruit';
    db.all(strCommand,(err,row) => {
        if(err){
            res.json({"status":400,"error":err.message});
        } else {
            res.json({"status":200, "message":"success","fruit":fruit.row});
        }
    })

});

app.post("/fruit", (req,res,next) => {

    let strName = req.query.name;
    let strColor = req.query.color;
    let strCommand = "INSERT INTO tblFruit (name, color) VALUES (?,?)";
    if(strName && strColor){
        let arrParameters = [strName, strColor];
        let objFruit = new Fruit(strName, strColor);
        db.run(strCommand, arrParameters, (err,row) => {
            if(err){
                res.json({"status":400,"error":err.message});
            } else {
                res.json({"status":201,"message":"success","fruit":objFruit});
            }
        })
    } else {
        res.json({"status":400,"error":"Not all parameters provided"});
    }


});

app.get("/fruit/:name", (req,res,next) => {
    
    let strName = req.params.name;
    if(strName){
        let strCommand = "SELECT * FROM tblFruit WHERE name=?";
        let arrParameters = [strName];
        db.all(strCommand,arrParameters,(err,row) => {
            if(err){
                res.json({"status":400,"error":err.message});
            } else {
                if(row.length < 1){
                    res.json({"status":200,"message":"error: not found"});
                } else {
                    res.json({"status":200,"message":"success","fruit":row});
                }
            }
        })
    } else {
        res.json({"status":400,"error":"No fruit name provided"});
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

app.post("/users", (req,res,next) => {

    let strEmail = req.query.email;
    let strPassword = req.query.password;
    if(strEmail && strPassword){
        bcrypt.hash(strPassword, 10).then(hash => {
            strPassword = hash;
            let strCommand = "INSERT INTO tblUsers (Email, Password) VALUES (?,?)";
            let arrParameters = [strEmail, strPassword];
            db.run(strCommand,arrParameters,function(err,rows){
                if(err){
                    res.json({"status":400,"error":err.message});
                } else {
                    res.json({"status":201,"message":"success","Email":strEmail});
                }
            })
        }) //salt it 10 times for best security and performance
    } else {
        res.json({"status":400,"error":"Not all parameters provided"});
    }

});

app.post("/sessions", (req,res,next) => {

    let strEmail = req.query.email;
    let strPassword = req.query.password;
    let strSessionID = uuidv4();
    if(strEmail && strPassword){
        bcrypt.hash(strPassword, 10).then(hash => {
            strPassword = hash;
            let strCommand = "SELECT * FROM tblUsers WHERE Email = ? AND Password = ?";
            let arrParameters = [strEmail, strPassword];
            db.all(strCommand, arrParameters, function(err, rows){
                if(err){
                    res.json({"status":400,"error":err.message});
                } else {
                    if(rows.length > 0){
                        strCommand = "INSERT INTO tblSessions VALUES (?,SELECT Email FROM tblUsers WHERE Email = ? AND Password = ?))";
                        arrParameters = [strSessionID, strEmail, strPassword];
                        db.run(strCommand,arrParameters,function(err,rows){
                            if(err){
                                res.json({"status":400,"error":err.message});
                            } else {
                                res.json({"status":201,"message":"success","SessionID":strSessionID});
                            }
                        })
                    }
                }
            })      
        }) //salt it 10 times for best security and performance
    } else {
        res.json({"status":400,"error":"Not all parameters provided"});
    }

});

app.listen(HTTP_PORT);
