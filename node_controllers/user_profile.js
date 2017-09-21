var express = require("express");
var app = express();
var db = require("../database/database_connect.js");
var session = require("./session_config.js");
var logger = require("./logger.js");

var bodyParser = require("body-parser");

var profile = express.Router();
app.use(logger);

var jsonParser = bodyParser.json();

profile.post("/my-profile", jsonParser, fetchUserProfile);
profile.get("/my-profile", function(req, res){
  if(req.session.email){
    res.render("index", {loggedIn: req.session.loggedIn});
  }else{
    res.redirect("/");
  }
});
profile.post("/wallet", jsonParser, fetchUserWallet);
profile.get("/wallet", function(req, res){
  if(req.session.email){
    res.render("index", {loggedIn: req.session.loggedIn});
  }else{
    res.redirect("/");
  }
});
profile.post("/updateUserInfo", jsonParser, updateUserInfo);

// TO FETCH THE USER DETAILS FROM DB
function fetchUserProfile(req, res, next){
    db((err, connection)=>{
      connection.query("select w.*, m.name, m.email, m.address, m.mobile, m.dob, m.city from wallet as w, member as m where m.email = w.email and m.email = ?", [req.session.email], function(error, result){
        if(error){
          //console.log(error);
          //res.send({status: 30, content: "Querying database failed"});
          res.status(400).send("Please try later");
        }else{
          //console.log(result);
          if(result.length == 1){
            ////console.log(result);
            res.status(200).send(result[0]);
            //res.send({status: 20, content: result[0]});
          }else{
            //console.log(result);
            res.status(404).send("User not found");
            //res.send({status: 21, content: "Sorry, User Not found"});
          }
        }
      });
      connection.release();
    });
}

// TO FETCH THE USER DETAILS FROM DB
function fetchUserWallet(req, res, next){
    db((err, connection)=>{
      connection.query("select * from transactions where walletId = (select walletId from wallet where email = ? )", [req.session.email], function(error, result){
        if(error){
          //console.log(error);
          res.status(400).send("Please try later");
          //res.send({status: 30, content: "Querying database failed"});
        }else{
          //console.log(result);
          if(result.length > 0){
            ////console.log(result);
            res.status(200).send(result);
            //res.send({status: 20, content: result});
          }else{
            ////console.log(result);
            res.status(404).send("No Transactions");
            //res.send({status: 21, content: "No Transactions for the User"});
          }
        }
      });
      connection.release();
    });
}

function updateUserInfo(req, res, next){
  var updateObj = new Object();
  updateObj.email = req.body.email;
  updateObj.name = req.body.name;
  updateObj.address = req.body.address;
  updateObj.mobile = req.body.mobile;
  updateObj.dob = req.body.dob;
  updateObj.city = req.body.city;
  db((err, connection)=>{
    connection.query("update member set email = ?,  name = ?, address = ?, mobile = ?, dob = ?, city = ? where email = ?", [updateObj.email, updateObj.name, updateObj.address, updateObj.mobile, updateObj.dob, updateObj.city, req.session.email], function(error, result){
      if(error){
        res.status(400).send("Please try later");
        //res.send({status: 30, content: "Querying database failed"});
      }else{
        res.status(200).send(result);
      }
    });
    connection.release();
  });
}

module.exports = profile;
