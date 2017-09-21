var express = require("express");
var app = express();
var session = require("express-session");
var mySqlStore = require("express-mysql-session")(session);
var db = require("../database/database_connect.js");

var connection = db((err, connection) => {
  if(err){
    console.log(err);
    return err;
  }else{
    return connection;
  }
});

var sessionStore = new mySqlStore({}, connection);

module.exports = session;
