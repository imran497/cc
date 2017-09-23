angular.module("cc")
.directive("displayCoupons", ["$rootScope", "$http", function($rootScope, $http){
  return{
    restrict: "E",
    scope: {
      coupon: "=",
      showBrand : "@"
    },
    templateUrl: "views/displayCoupons.ejs",
    controller: ["$scope", "$attrs", "$element", function($scope, $attrs, $element){

      $scope.expired = false;

      if(moment($scope.coupon['ValidTill'], "YYYY-MM-DD").isBefore(moment().format("YYYY-MM-DD"))){
        $scope.expired = true;
      }


      $scope.coupon['ValidTill'] = moment($scope.coupon['ValidTill'], "YYYY-MM-DD").format("D MMM YYYY");

      $scope.showCode = false;
      $scope.couponClickEvent = function(coupon){
        $scope.showCode = true;
        var ex = window.open(coupon.Url, '_blank');
      };
    }]
  }
}]);
