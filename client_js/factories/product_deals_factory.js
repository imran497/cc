angular.module("cc")
.factory("productDealsFactory", ["$rootScope", "$http", function($rootScope, $http){
  var products = new Object();

  products.getProducts = function(){
    var getProductsPromise = $http.post("/deals/getProductDeals", function(data, error){
      if(error){
        return(error);
      }
      else{
        return(data);
      }
    });

    return getProductsPromise;
  }

  return products;
}]);
