angular.module("cc")
.controller("couponsByCategoryController", ["$scope", "$routeParams", "getInfoFactory", function($scope, $routeParams, getInfoFactory){
  $scope.couponsCategory = new Array();
  $scope.allBrands = new Array();
  $scope.category = $routeParams.category;
  $scope.relatedBrands = new Array();
  $scope.relatedCoupons = new Array();
  $scope.brandLogos = new Array();

  // FETCHIG THE COUPONS BY BRAND NAME
  getInfoFactory.getCouponsByCategory($routeParams.category).then(function(result){
    if(result.status == 200){
      for(var i = 0, len = result.data.length; i < 4; i++){
        (result.data[i])?$scope.brandLogos.push(result.data[i].BrandLogo):"";
      }
      $scope.couponsCategory = result.data.slice();
    }
  }, function(error){

  });

  // FETCHIG THE RELATED BRANDS BY BRAND NAME
  getInfoFactory.getRelatedBrands($routeParams.category, 'category').then(function(result){
      if(result.status == 200){
        $scope.relatedBrands = result.data.slice();
      }
  }, function(error){

  });

  // FETCHIG THE RELATED COUPONS BY BRAND NAME
  getInfoFactory.getRelatedCoupons($routeParams.category, 'category').then(function(result){
      if(result.status == 200){
        $scope.relatedCoupons = result.data.slice();
      }
  }, function(error){

  });

  //getInfoFactory.getCouponsWithFilter()

}]);
