var express = require("express");
var app = express();
var multer = require("multer");
var upload = multer();
var bodyParser = require("body-parser");
var db = require("../database/database_connect.js");
var logger = require("./logger.js");

var session = require("./session_config.js");

app.use(session({secret: "immu@497", saveUninitialized: false, resave: true}));
app.use(logger);

var productDeals = express.Router();

app.use(bodyParser.json());
var jsonParser = bodyParser.json();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

productDeals.post("/getProductDeals", getProductDeals);
productDeals.post("/productClicked", jsonParser, productClicked);
productDeals.get("/today-hot-deals", (req, res, next)=>{
  res.render("index", {loggedIn: req.session.loggedIn});
});

/* FETCHING THE COUPONS FOR A PARTICULAR BRAND */
function getProductDeals(req, res, next){
  db((err, connection) =>{
    connection.query("select b.*, p.* from brands as b, productdeals as p where p.brandid = b.id and (datediff(validtill, now()) > 0);", (err, result)=>{
      if(err){
        //console.log(err);
        res.status(400).send("Please try Later");
      }else{
        //console.log(result);
        res.status(200).send(result);
        //res.send(result);
      }
    });
    connection.release();
  });
}

function productClicked(req, res, next){
  db((err, connection) =>{
    connection.query("update productdeals set clicks = clicks+1 where id = ?", [req.body.productId], (err, result)=>{
      if(err){
        //console.log(err);
        res.status(400).send("Please try Later");
      }else{
        //console.log(result);
        res.status(200).send(result);
        //res.send(result);
      }
    });
    connection.release();
  });
}

module.exports = productDeals;
