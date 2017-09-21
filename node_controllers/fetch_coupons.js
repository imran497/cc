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

var coupons = express.Router();

app.use(bodyParser.json());
var jsonParser = bodyParser.json();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

coupons.post("/brand/:brandName", fetchByBrandName);
coupons.get("/brand/:brandName", (req, res, next)=>{
  res.render("index", {loggedIn: req.session.loggedIn});
});

coupons.post("/category/:category", fetchByCategory);
coupons.get("/category/:category", (req, res, next)=>{
  res.render("index", {loggedIn: req.session.loggedIn});
});

coupons.post("/coupon/:id", fetchSingleCoupon);
coupons.get("/coupon/:id", (req, res, next)=>{
  res.render("index", {loggedIn: req.session.loggedIn});
});

coupons.post("/search/:searchItem", fetchCouponBySearch);
coupons.get("/search/:searchItem", (req, res, next)=>{
  res.render("index", {loggedIn: req.session.loggedIn});
});

coupons.post("/getAllBrands", fetchAllBrands);
coupons.post("/getAllCategoriesForFilter", jsonParser, fetchAllCategoriesForFilter);
coupons.post("/getAllBrandsForFilter", jsonParser, fetchAllBrandsForFilter);
coupons.post("/getTopBrands", jsonParser, fetchTopBrands);
coupons.post("/getTopCategories", jsonParser, fetchTopCategories);
coupons.post("/getTopCategoryCoupons", jsonParser, fetchTopCategoryCoupons);
coupons.post("/getCouponsWithFilter", jsonParser, fetchCouponsWithFilter);
coupons.post("/getRelatedBrands", jsonParser, fetchRelatedBrands);
coupons.post("/getRelatedCoupons", jsonParser, fetchRelatedCoupons);
coupons.post("/chceckBrandExist", jsonParser, chceckBrandExist);
coupons.post("/trendingCoupons", jsonParser, trendingCoupons);

/* FETCHING THE COUPONS FOR A PARTICULAR BRAND */
function fetchByBrandName(req, res, next){
  var reqParam = (req.params.brandName).toString();
  db((err, connection) =>{
    connection.query("select brandSet.*, categorySet.*, couponSet.* from brands as brandSet, coupons as couponSet, category as categorySet where couponSet.BrandId = brandSet.id and couponSet.CategoryId = categorySet.id and brandSet.BrandName like ('%"+reqParam+"%') order by (select datediff(couponSet.ValidTill, now())) desc", (err, result)=>{
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

/* FETCHING THE COUPONS FOR A PARTICULAR CATEGORY */
function fetchByCategory(req, res, next){
  var reqParam = (req.params.category).toString();
  db((err, connection) =>{
    connection.query("select brandSet.*, categorySet.*, couponSet.* from brands as brandSet, coupons as couponSet, category as categorySet where couponSet.BrandId = brandSet.id and couponSet.CategoryId = categorySet.id and categorySet.CategoryName like ('%"+reqParam+"%') order by (select datediff(couponSet.ValidTill, now())) desc", (err, result)=>{
      if(err){
        //console.log(err);
        res.status(400).send("Please try Later");
        //res.send(err);
      }else{
        //console.log(result);
        res.status(200).send(result);
        //res.send(result);
      }
    });
    connection.release();
  });
}

// FETCH ALL BRANDS
function fetchAllBrands(req, res, next){
  db((err, connection)=>{
    connection.query("select b.* from coupons as c, brands as b, category as ca where c.BrandId = b.id and ca.id = c.CategoryId group by b.id", (err, result)=>{
      if(err){
        //console.log(err);
        res.status(400).send("Please try Later");
        //res.send({status: 30, content: "Unable to query database"});
      }else{
        //console.log(result);
        if(result.length > 0){
          res.status(200).send(result);
          //res.send({status: 20, content: result});
        }else{
          res.status(404).send("No Brands");
          //res.send({status: 21, content: "No Brands"});
        }
      }
    });
    connection.release();
  });
}

//FETCH ALL CATEGORIES FOR FILTER
function fetchAllCategoriesForFilter(req, res, next){
  db((err, connection)=>{
    connection.query("select ca.* from coupons as c, brands as b, category as ca where c.BrandId = b.id and ca.id = c.CategoryId and b.BrandName = ? group by ca.id", [req.body.brandNameForFilter], (err, result)=>{
      if(err){
        //console.log(err);
        res.status(400).send("Please try Later");
        //res.send(err);
      }else{
        //console.log(result);
        res.status(200).send(result);
        //res.send(result);
      }
    });
    connection.release();
  });
}

//FETCH ALL BRANDS FOR FILTER
function fetchAllBrandsForFilter(req, res, next){
  db((err, connection)=>{
    connection.query("select b.* from coupons as c, brands as b, category as ca where c.BrandId = b.id and ca.id = c.CategoryId and ca.Categoryname = ? group by b.id", [req.body.categoryForFilter], (err, result)=>{
      if(err){
        //console.log(err);
        res.status(400).send("Please try Later");
        //res.send(err);
      }else{
        //console.log(result);
        res.status(200).send(result);
        //res.send(result);
      }
    });
    connection.release();
  });
}

//FUNCTION FETCH TOP BRANDS
function fetchTopBrands(req, res, next){
  var filter = "(";
  for(var i = 0, len = req.body.topBrands.length; i < len; i++){
    (i == len-1)?(filter += req.body.topBrands[i].toString() + ")"):(filter += req.body.topBrands[i].toString() + ", ");
  }
  db((err, connection)=>{
    connection.query("select * from brands where id in " + filter, (err, result)=>{
      if(err){
        //console.log(err);
        res.status(400).send("Please try Later");
        //res.send(err);
      }else{
        //console.log(result);
        res.status(200).send(result);
        //res.send(result);
      }
    });
    connection.release();
  });
}

//FUNCTION FETCH TOP CATEGORIES
function fetchTopCategories(req, res, next){
  var filter = "(";
  for(var i = 0, len = req.body.topCategories.length; i < len; i++){
    (i == len-1)?(filter += req.body.topCategories[i].toString() + ")"):(filter += req.body.topCategories[i].toString() + ", ");
  }
  db((err, connection)=>{
    connection.query("select * from category where id in " + filter, (err, result)=>{
      if(err){
        //console.log(err);
        res.status(400).send("Please try Later");
        //res.send(err);
      }else{
        //console.log(result);
        res.status(200).send(result);
        //res.send(result);
      }
    });
    connection.release();
  });
}

//FETCH TOP CATEGORY COUPONS
function fetchTopCategoryCoupons(req, res, next){
  db((err, connection)=>{
    connection.query("select brandSet.*, couponSet.* from brands as brandSet, coupons as couponSet where couponSet.BrandId = brandSet.id and couponSet.categoryId = ?  order by (select datediff(couponSet.ValidTill, now())) desc limit 12", req.body.categoryId, (err, result)=>{
      if(err){
        //console.log(err);
        res.status(400).send("Please try Later");
        //res.send(err);
      }else{
        //console.log(result);
        res.status(200).send(result);
        //res.send(result);
      }
    });
    connection.release();
  });
}

// FETCH COUPON WITH FILTER
function fetchCouponsWithFilter(req, res, next){
  if(req.body.categoryFiltersApplied){
    var categoryFiltersApplied = new Array();
    categoryFiltersApplied = req.body.categoryFiltersApplied.slice();
    var categoryFilterString = "";
    if(categoryFiltersApplied.length > 0){
      categoryFilterString += " and c.CategoryId in (";
      for(var i = 0, len = categoryFiltersApplied.length; i < len; i++){
        categoryFilterString = (i == len-1)?(categoryFilterString += categoryFiltersApplied[i]):(categoryFilterString += categoryFiltersApplied[i] + ", ");
      }
      categoryFilterString = categoryFilterString + ")";
    }else{
      categoryFilterString = "";
    }

    var query = "select ca.*, b.*, c.* from coupons as c, brands as b, category as ca where c.BrandId = b.id and ca.id = c.CategoryId and b.BrandName like ('%"+ req.body.brandName +"%')" + categoryFilterString +  "order by (select datediff(c.ValidTill, now())) desc";
  }
  else if(req.body.brandFiltersApplied){
    var brandFiltersApplied = new Array();
    brandFiltersApplied = req.body.brandFiltersApplied.slice();
    var brandFilterString = "";
    if(brandFiltersApplied.length > 0){
      brandFilterString += " and c.BrandId in (";
      for(var i = 0, len = brandFiltersApplied.length; i < len; i++){
        brandFilterString = (i == len-1)?(brandFilterString += brandFiltersApplied[i]):(brandFilterString += brandFiltersApplied[i] + ", ");
      }
      brandFilterString = brandFilterString + ")";
    }else{
      brandFilterString = "";
    }

    var query = "select ca.*, b.*, c.* from coupons as c, brands as b, category as ca where c.BrandId = b.id and ca.id = c.CategoryId and ca.Categoryname like '%"+req.body.category+"%'" + brandFilterString + " order by (select datediff(c.ValidTill, now())) desc";
  }

  db((err, connection)=>{
    connection.query(query, (err, result)=>{
      if(err){
        //console.log(err);
        res.status(400).send("Please try Later");
        //res.send(err);
      }else{
        //console.log(result);
        res.status(200).send(result);
        //res.send(result);
      }
    });
    connection.release();
  });
}

//FETCH A SINGLE COUPON WITH ID
function fetchSingleCoupon(req, res, next){

  var query = "select brandSet.*, categorySet.*, couponSet.* from brands as brandSet, coupons as couponSet, category as categorySet where couponSet.BrandId = brandSet.id and couponSet.CategoryId = categorySet.id ";
  query += "and couponSet.id = ?"

  db((err, connection)=>{
    connection.query(query, [req.params.id], (err, result)=>{
      if(err){
        //console.log(err);
        res.status(400).send("Please try Later");
        //res.send(err);
      }else{
        //console.log(result);
        res.status(200).send(result);
        //res.send(result);
      }
    });
    connection.release();
  });
}

//FETCH RELATED BRANDS
function fetchRelatedBrands(req, res, next){
  var query = "";
  if(req.body.filterData['type'] == "brand"){
    query = "select b.* from brands as b, coupons as c where b.id not in (select id from brands where brandName = ?) and b.brandCategory in (select brandCategory from brands where brandName = ?) and c.BrandId = b.id group by b.id limit 15";
  }
  else if(req.body.filterData['type'] == "category"){
    query = "select b.* from brands as b, coupons as c where b.brandCategory in (select id from category where categoryName = ?) and c.BrandId = b.id group by b.id limit 15";
  }
  db((err, connection)=>{
    connection.query(query, [req.body.filterData['filter'], req.body.filterData['filter']], (err, result)=>{
      if(err){
        console.log(err);
        res.status(400).send("Please try Later");
        //res.send({status: 30, content: "Unable to Query Database"});
      }else{
        //console.log(result);
        res.status(200).send(result);
        //res.send({status: 20, content: result});
      }
    });
    connection.release();
  });
}

//FETCH RELATED COUPONS
function fetchRelatedCoupons(req, res, next){
  req.body.relatedData['parameter'] = req.body.relatedData['parameter'].toString();
  var query = "";
  if(req.body.relatedData['type'] == "brand"){
    query = "select ca.*, b.*, c.* from category as ca, brands as b, coupons as c where c.BrandId = b.id and ca.id = c.CategoryId and c.CategoryId in (select brandcategory from brands where brandname = '" + req.body.relatedData['parameter'] + "') and b.BrandName != '" + req.body.relatedData['parameter'] + "' limit 10";
  }
  else if(req.body.relatedData['type'] == "category"){
    query = "select ca.*, b.*, c.* from category as ca, brands as b, coupons as c where c.BrandId = b.id and ca.id = c.CategoryId and c.CategoryId not in (select id from category where Categoryname = '" + req.body.relatedData['parameter'] + "') group by b.id limit 10";
  }
  else if(req.body.relatedData['type'] == "coupon"){
    query = "select ca.*, b.*, c.* from category as ca, brands as b, coupons as c where c.BrandId = b.id and ca.id = c.CategoryId and c.CategoryId in (select CategoryId from coupons where id = '" + req.body.relatedData['parameter'] + "') and c.id != '" + req.body.relatedData['parameter'] + "' group by b.id limit 10";
  }
  db((err, connection)=>{
    connection.query(query, (err, result)=>{
      if(err){
        //console.log(err);
        res.status(400).send("Please try Later");
        //res.send({status: 30, content: "Unable to Query Database"});
      }else{
        //console.log(result);
        res.status(200).send(result);
        //res.send({status: 20, content: result});
      }
    });
    connection.release();
  });
}

//FETCH COUPONS BY SEARCH
function fetchCouponBySearch(req, res, next){
  var query = "select ca.*, b.*, c.* from category as ca, brands as b, coupons as c where c.BrandId = b.id and ca.id = c.CategoryId and (ca.Categoryname like ('" + req.params.searchItem.toString() + "%') or b.BrandName like ('" + req.params.searchItem.toString() + "%') or title like ('%" + req.params.searchItem.toString() + "%'))";
  db((err, connection)=>{
    connection.query(query, (err, result)=>{
      if(err){
        //console.log(err);
        res.status(400).send("Please try Later");
        //res.send(err);
      }else{
        //console.log(result);
        res.status(200).send(result);
        //res.send(result);
      }
    });
    connection.release();
  });
}

//CHECK IF BRAND EXISTS
function chceckBrandExist(req, res, next){
  var query = "select * from brands where brandname = ? group by brandname";
  db((err, connection)=>{
    connection.query(query, [req.body.searchQuery], (err, result)=>{
      if(err){
        res.status(400).send("Please try Later");
        //res.send(err);
      }else{
        res.status(200).send(result);
        //res.send(result);
      }
    });
    connection.release();
  });
}

function trendingCoupons(req, res, next){
  var query = "select b.*, c.* from coupons as c, brands as b where c.brandid = b.id and c.id in (?)";
  db((err, connection)=>{
    connection.query(query, [req.body.trendingCoupons], (err, result)=>{
      if(err){
        res.status(400).send("Please try Later");
        //res.send(err);
      }else{
        res.status(200).send(result);
        //res.send(result);
      }
    });
    connection.release();
  });
}

module.exports = coupons;
