var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var multer = require("multer");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, 'coupons.csv')
    }
});
var upload = multer({ storage: storage });
var mysql = require("mysql");

var db = require("../database/database_connect.js");

var admin = express.Router();

var jsonParser = bodyParser.json();
app.use(bodyParser.urlencoded({ extended: true }));

admin.post('/uploadCouponData', upload.single('file'), function(req, res){
  db((err, connection) => {
    var query = "Load data infile '" + (__dirname).replace(/\\/g, "/") + "/uploads/coupons.csv'" +
        " into table coupons" +
        " fields terminated by ',' optionally enclosed by '\"'" +
        " lines terminated by '\\r\\n'" +
        " ignore 1 lines (@Title, @Description, @ValidTill, @Code, @CategoryId, @BrandId, @Url, @DiscountPercent, @Location)" +
        " set Title = @Title, Description = @Description, ValidTill = @ValidTill, Code = @Code, CategoryId = @CategoryId, BrandId = @BrandId, Url = @Url, DiscountPercent = @DiscountPercent, Location = @Location";
    connection.query(query, function(error, result){
      if(error){
        res.status(400).send("Error Uploading Data");
      }else{
        res.status(200).send(result);
      }
    });

  });
});

module.exports = admin;
