angular.module("cc")
.controller("couponsBySearchController", ["$scope", "$routeParams", "getInfoFactory", function($scope, $routeParams, getInfoFactory){
  $scope.couponsSearch = new Array();
  // FETCHIG THE COUPONS BY BRAND NAME
  getInfoFactory.getCouponsBySearch($routeParams.searchItem).then(function(result){
    if(result.status == 200){
      $scope.couponsSearch = result.data.slice();
    }
  }, function(error){
    console.log(error);
  });

  //getInfoFactory.getCouponsWithFilter()

}]);
