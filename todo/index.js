const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3");
const dbSource = ("todo.db");
const {v4:uuidv4} = require("uuid");

const db = new sqlite3.Database(dbSource);

const HTTP_PORT = 8080;

var app = express();
app.use(cors());

app.get("/", (req,res,next) => {

    let strCommand = "SELECT * FROM tblTasks";
    db.all(strCommand,(err,row) => {
        if(err){
            res.json({"status":400,"error":err.message});
        } else {
            res.json({"status":200,"message":"success","tasks":row});
        }
    })
});

app.get("/todo/:name", (req,res,next) => {

    let strName = req.params.name;
    if(strName){
        let strCommand = "SELECT * FROM tblTasks WHERE TaskName=?";
        let arrParameters = [strName];
        db.all(strCommand,arrParameters,(err,row) => {
            if(err){
                res.json({"status":400,"error":err.message});
            } else {
                if(row.length < 1){
                    res.json({"status":200,"message":"error: not found"});
                } else {
                    res.json({"status":200,"message":"success","task":row});
                }
            }
        })
    } else {
        res.json({"status":400,"error":"No task name provided"});
    }

});

app.post("/todo/:id", (req,res,next) => {

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

app.listen(HTTP_PORT, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", HTTP_PORT);
    console.log("Hosted on http://localhost:" + HTTP_PORT);
})