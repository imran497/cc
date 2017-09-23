var express = require("express");
var app = express();
var auth = require("./node_controllers/authorize.js")
var admin = require("./node_controllers/admin.js")
var coupons = require("./node_controllers/fetch_coupons.js");
var profile = require("./node_controllers/user_profile.js");
var productDeals = require("./node_controllers/todayHotDeals.js");
var sass = require("node-sass");
var fs = require("fs");
var logger = require("./node_controllers/logger.js");

var db = require("./database/database_connect.js");
var session = require("./node_controllers/session_config.js");

app.use(session({secret: "immu@497", saveUninitialized: false, resave: true}));
app.use(logger);

app.use("/", express.static(__dirname));

var ejs = require("ejs");

app.set("view engine", "ejs");

app.set('views', __dirname + "/views");

app.use("/authenticate", auth);
app.use("/coupons", coupons);
app.use("/profile", profile);
app.use("/admin", admin);
app.use("/deals", productDeals);

/*app.use("*", (req, res) =>{
  console.log("file is rendered");
  res.render("index");
});*/

// GET BANNER DATA FOR HOME PAGE
app.post("/bannerContent", function(req, res, next){
  db((err, connection) => {
    connection.query("select * from banners", function(error, result){
      if(error){
        res.status(400).send("Please try later");
      }else{
        if(result.length > 0){
          res.status(200).send(result);
        }else{
          res.status(404).send("No data");
        }
      }
    });
    connection.release();
  });
});

app.get("/", (req, res) =>{
  res.render("index", {loggedIn: req.session.loggedIn});
});

app.get("*", (req, res) =>{
  res.render("index", {loggedIn: req.session.loggedIn});
});

sass.render({file: __dirname+"/css/main_styles.scss", outFile: __dirname+"css/main_styles.css"}, function(error, result) {
						    if(!error){
									fs.writeFile(__dirname+"/css/main_styles.css", result.css, function(err){
									  if(!err){
											console.log(err);
									  }
									});
								}
								else {
									console.log(error);
								}
							});
              sass.render({file: __dirname+"/css/styles.scss", outFile: __dirname+"css/styles.css"}, function(error, result) {
              						    if(!error){
              									fs.writeFile(__dirname+"/css/styles.css", result.css, function(err){
              									  if(!err){
              											console.log(err);
              									  }
              									});
              								}
              								else {
              									console.log(error);
              								}
              							});
                            sass.render({file: __dirname+"/css/responsive_styles.scss", outFile: __dirname+"css/responsive_styles.css"}, function(error, result) {
                            						    if(!error){
                            									fs.writeFile(__dirname+"/css/responsive_styles.css", result.css, function(err){
                            									  if(!err){
                            											console.log(err);
                            									  }
                            									});
                            								}
                            								else {
                            									console.log(error);
                            								}
                            							});

app.listen(3001);
