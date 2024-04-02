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
    db.all(strCommand,(err,rows) => {
        if(err){
            res.json({"status":400,"error":err.message});
        } else {
            res.json({"status":200,"message":"success","tasks":rows});
        }
    })
});

app.get("/todo/:name", (req,res,next) => {

    let strName = req.params.name;
    if(strName){
        let strCommand = "SELECT * FROM tblTasks WHERE TaskName=?";
        let arrParameters = [strName];
        db.all(strCommand,arrParameters,(err,rows) => {
            if(err){
                res.json({"status":400,"error":err.message});
            } else {
                if(rows.length < 1){
                    res.json({"status":200,"message":"error: not found"});
                } else {
                    res.json({"status":200,"message":"success","task":rows});
                }
            }
        })
    } else {
        res.json({"status":400,"error":"No task name provided"});
    }

});

app.post("/todo", (req,res,next) => {

    let strName = req.query.name;
    let dateDue = req.query.duedate;
    let strCommand = "INSERT INTO tblTasks (name, color) VALUES (?,?)";
    if(strName && strColor){
        let arrParameters = [strName, strColor];
        db.run(strCommand, arrParameters, (err,rows) => {
            if(err){
                res.json({"status":400,"error":err.message});
            } else {
                res.json({"status":201,"message":"success","task":rows});
            }
        })
    } else {
        res.json({"status":400,"error":"Not all parameters provided"});
    }

});

app.delete("/todo", (req,res,next) => {
    
    let strID = req.query.id;
    let strCommand = "DELETE FROM tblTasks WHERE TaskID=?";
    let arrParameters = [strID];
    if(strID){
        db.run(strCommand, arrParameters, (err,rows) => {
            if(err){
                res.json({"status":400,"error":err.message});
            } else {
                res.json({"status":201,"message":"success","task":rows});
            }
        })
    } else {
        res.json({"status":200,"message":"Task not found"});
    }

});

app.listen(HTTP_PORT, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", HTTP_PORT);
    console.log("Hosted on http://localhost:" + HTTP_PORT);
})