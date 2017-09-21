var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var multer = require("multer");
var upload = multer();
var mysql = require("mysql");
var nodemailer = require("nodemailer");
var GoogleAuth = require('google-auth-library');

var db = require("../database/database_connect.js");

var session = require("./session_config.js");

app.use(session({secret: "immu@497", saveUninitialized: false, resave: true}));

var auth = express.Router();

var jsonParser = bodyParser.json();
app.use(bodyParser.urlencoded({ extended: true }));

auth.get("/logout", function(req, res, next){
  req.session.destroy(function(err){
    if(err){
      res.status(400);
    }else{
      res.status(200).send("Loggedout Successfully");
    }
  });
});

auth.post("/login", jsonParser, userLogin);
auth.post("/register", jsonParser, userRegisterCheck);
auth.post("/forgotPassword", jsonParser, forgotPassword);
auth.get("/activateReset", jsonParser, activateReset);
auth.post("/resetPassword", jsonParser, resetPassword);
auth.post("/googleLogin", jsonParser, googleLogin);

var transporter = nodemailer.createTransport({
    host: 'mail.couponcrown.com',
    port: 587,
    secure: false,
    tls: {
        rejectUnauthorized: false
    },
    auth: {
        user: 'admincc@couponcrown.com',
        pass: 'coupon@123'
    }
});

// USER LOGIN FUNCTION
function userLogin(req, res, next){
  var creds = new Object();
  if(!(req.body.login_creds['email'] && req.body.login_creds['password'])){
    res.status(404).send("Invalid Details");
  }else{
    creds.email = req.body.login_creds['email'].toString();
    creds.password = req.body.login_creds['password'].toString();
    var query = 'select email, password from member where email = "' + creds.email + '" and password = "' + creds.password + '"';
    db((err, connection) => {
        connection.query(query, (err, result) => {
          if(err){
            //console.log(err);
            res.status(400).send("Error... Pleaase Try later...");
          }else{
            //console.log(result);
            if(result.length == 1){
              req.session.email = result[0].email;
              req.session.loggedIn = true;
              res.status(200).send(result[0]);
              //console.log(result[0]);
              //console.log(req.session);
            }else{
              res.status(404).send("Email or Password Incorrect");
            }
          }
        });
    });
  }
}

// USER REGISTER CHECK IF ALREADY EXISTS FUNCTION
function userRegisterCheck(req, res, next){
  db((err, connection) => {
    connection.query("select * from member where email = ?", req.body.register_details['email'], (err, result)=>{
      if(err){
        //console.log(err);
        res.status(400).send("Please try later...");
      }else{
        //console.log(result);
        if(result.length > 0){
          res.status(302).send("User already Registered");
        }else{
          userRegister(req, res, next);
        }
      }
    });
  });
}

// USER REGISTER FUNCTION
function userRegister(req, res, next){
  db((err, connection) => {
    connection.query("insert into member set ?", req.body.register_details, (err, result)=>{
      if(err){
        //console.log(err);
        res.status(400).send("Please try later");
      }else{
        //console.log(result);
        if(result.affectedRows == 1 && result.insertId){
          connection.query("insert into wallet set ?", {email: req.body.register_details['email'], amount: 0}, function(wErr, wResult){
            if(wErr){
              //console.log(wErr);
              res.status(400).send("Unable to register Wallet");
            }else{
              //console.log(wResult);
              if(wResult.affectedRows == 1 && wResult.insertId){
                req.session.email = req.body.register_details['email'];
                req.session.loggedIn = true;
                res.status(200).send("User Registered Successfully");
              }else{
                res.status(400).send("Registered. Contact support for Wallet");
              }
            }
          });
        }else{
          //console.log(result);
          res.status(400).send("Registration failed. Please try later");
        }
      }
    });
  });
}



//--------------------------- RESETTING PASSWORD ----------------------------\\
// FORGOT PASSWORD
function forgotPassword(req, res, next){
  var to_toencode = new Buffer(req.body.reset_email);
  var to_encoded = encodeURIComponent(to_toencode.toString("base64"));
  var link_encoded = '<html><body><div style="width: 100%; text-align: center">' +
                        '<p style="color: blue">Click on the below link to reset the password</p>' +
                        '<a href="http://89.107.56.248:3001/authenticate/activateReset?token='+to_encoded+'">Click Here</a>' +
                      '</div></body></html>';
  var mailOptions = {
      from: '"Admin - CC" <admincc@couponcrown.com>', // sender address
      to: req.body.reset_email, // list of receivers
      subject: 'Reset CouponCrown account password', // Subject line
      text: 'Click below link to reset password', // plain text body
      html: link_encoded // html body
  };


  db((err, connection) => {
    connection.query("select * from member where email = ?", [req.body.reset_email], function(err, result){
      if(err){
        //console.log(err);
        res.status(400).send("Please try later");
      }else{
        //console.log(result);
        if(result.length != 1){
          res.status(404).send("Email Id doesn't exist");
          res.end();
        }
        else{
          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              //console.log(err);
              res.status(400).send("Please try later");
            }
            //console.log(result);
            res.status(200).send("Reset link is sent to " + req.body.reset_email);
          });
        }
      }
    });
  });




}

function activateReset(req, res, next){
  var userToReset = new Buffer(decodeURIComponent(req.query.token), 'base64').toString();
  db((err, connection)=>{
    connection.query("select count(*) as count from member where email = ?", [userToReset], (err, result)=>{
      if(err){
        //console.log(err);
        res.status(400).send("Please try later");
      }else{
        //console.log(result);
        if(result[0].count == 1){
          res.status(200).render("index", {loggedIn: req.session.loggedIn});
        }else{
          res.status(404).send("Invalid reset link. Please Contact support or Try again");
        }
      }
    });
  });
}

//TO RESET PASSWORD
function resetPassword(req, res, next){
  var userToReset = new Buffer(decodeURIComponent(req.body.user_details['user']), 'base64').toString();
    db((err, connection) => {
      connection.query("update member set password = ? where email = ?",[req.body.user_details['password'], userToReset], (err, result)=>{
        if(err){
          //console.log(err);
          res.status(400).send("Please try later");
        }else{
          //console.log(result);
          if(result.affectedRows == 1){
            res.status(200).send("Password updated. Please login");
          }else{
            res.status(404).send("Update failed. Please check details");
          }
        }
      });
    });
}

function googleLogin(req, res, next){
  var authGoogle = new GoogleAuth;
  var client = new authGoogle.OAuth2('282019346056-fe70mm89snqr5qp5k4ivh8fh5g5dnc8u.apps.googleusercontent.com', '', '');
  client.verifyIdToken(
      req.body.userId,
      '282019346056-fe70mm89snqr5qp5k4ivh8fh5g5dnc8u.apps.googleusercontent.com',
      function(e, login) {
        if(e){
          res.status(400).send("Please try later");
        }else{
          var payload = login.getPayload();
          //console.log(payload);
          var query = 'select * from member where email = "' + payload.email +'"';
          db((err, connection) => {
              // CHECKING IF THE USER ALREADY EXISTS
              connection.query(query, (err, result) => {
                if(err){
                  //console.log(err);
                  res.status(400).send("Error... Pleaase Try later...");
                }else{
                  //console.log(result);
                  if(result.length == 1){
                    req.session.email = payload.email;
                    req.session.loggedIn = true;
                    res.status(200).send(result[0]);
                    //console.log(result[0]);
                    //console.log(req.session);
                  }else{
                    // CREATING NEW USER
                    connection.query("insert into member (name, email, password) values (?, ?, ?)", [payload.given_name, payload.email, 'Google@123'], (inserterr, insertresult)=>{
                      if(inserterr){
                        //console.log(err);
                        res.status(400).send("Please try later");
                      }else{
                        //console.log(result);
                        if(insertresult.affectedRows == 1 && insertresult.insertId){
                          connection.query("insert into wallet set ?", {email: payload.email, amount: 0}, function(wErr, wResult){
                            if(wErr){
                              //console.log(wErr);
                              res.status(400).send("Unable to register Wallet");
                            }else{
                              //console.log(wResult);
                              if(wResult.affectedRows == 1 && wResult.insertId){
                                req.session.email = payload.email;
                                req.session.loggedIn = true;
                                res.status(200).send("User Registered Successfully");
                              }else{
                                res.status(400).send("Registered. Contact support for Wallet");
                              }
                            }
                          });
                        }else{
                          //console.log(result);
                          res.status(400).send("Registration failed. Please try later");
                        }
                      }
                    });

                  }
                }
              });
            });
        }
    });
}

module.exports = auth;
