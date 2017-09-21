angular.module("cc")
.controller("couponsByBrandNameController", ["$scope", "$routeParams", "getInfoFactory", function($scope, $routeParams, getInfoFactory){
  $scope.couponsByBrandName = new Array();
  $scope.allBrands = new Array();
  $scope.brandName = $routeParams.brandName;
  $scope.relatedBrands = new Array();
  $scope.relatedCoupons = new Array();
  $scope.brandLogo = "dummy.png";

  // FETCHIG THE COUPONS BY BRAND NAME
  getInfoFactory.getCouponsByBrandName($routeParams.brandName).then(function(result){
    if(result.status == 200){
      $scope.brandLogo = result.data[0].BrandLogo;
      $scope.couponsByBrandName = result.data.slice();
    }
  }, function(error){

  });

  // FETCHIG THE RELATED BRANDS BY BRAND NAME
  getInfoFactory.getRelatedBrands($routeParams.brandName, 'brand').then(function(result){
    if(result.status == 200){
        $scope.relatedBrands = result.data.slice();
    }
  }, function(error){

  });

  // FETCHIG THE RELATED COUPONS BY BRAND NAME
  getInfoFactory.getRelatedCoupons($routeParams.brandName, 'brand').then(function(result){
    if(result.status == 200){
        $scope.relatedCoupons = result.data.slice();
    }
  }, function(error){

  });


}]);
