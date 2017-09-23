angular.module("cc")
.controller("homeController", ["$rootScope", "$scope", "$http", "getInfoFactory", function($rootScope, $scope, $http, getInfoFactory){

  $scope.topBrands = new Array();
  $scope.bannerContent = new Array();
  $scope.trendingCoupons = new Array();

  getInfoFactory.getConfig().then(function(result, error){
    if(!error){
      getInfoFactory.getTopBrandsFromDb(result.data).then(function(dbResult, dbError){
        if(!dbError){
          $scope.topBrands = dbResult.data.slice();
        }
      });
      getInfoFactory.getTrendingCoupons(result.data).then(function(dbResult, dbError){
        if(!dbError){
          $scope.trendingCoupons = dbResult.data.slice();
        }
      });
    }
  });

  $http.post("/bannerContent").then(function(success){
    if(success.status == 200){
      $scope.bannerContent = success.data;
    }
  }, function(error){

  });

  jQuery(document).ready(function(){
    $('.carousel').carousel({
      interval: 3000,
    });

    $scope.prevSlide = function(){
      jQuery('.carousel').carousel('prev');
    }
    $scope.nextSlide = function(){
      jQuery('.carousel').carousel('next');
    }

  });



}]);
