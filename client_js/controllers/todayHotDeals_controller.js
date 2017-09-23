angular.module("cc")
.controller("todayHotDealsController", ["$scope","$http", "$routeParams", "productDealsFactory", function($scope, $http, $routeParams, productDealsFactory){

  $scope.productsArray = new Array();

  productDealsFactory.getProducts().then(function(success){
    if(success.data.length > 0){
      $scope.productsArray = success.data.slice();
    }
  }, function(error){

  });

  $scope.productClicked = function(id){
    $http.post("/deals/productClicked", {productId: id});
  }

}]);
