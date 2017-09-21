angular.module("cc")
.service("activateCouponService", ["$rootScope", "$http", function($rootScope, $http){

  this.couponClick = function(targetUrl, couponCode){
    window.open(targetUrl);
  }
}]);
