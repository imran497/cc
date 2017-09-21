angular.module("cc")
.controller("singleCouponController", ["$scope","$http", "getInfoFactory", "$routeParams", function($scope, $http, getInfoFactory, $routeParams){

  $scope.couponData = new Array();
  $scope.relatedCoupons = new Array();

  getInfoFactory.getSingleCoupon($routeParams.id).then(function(success){
    success.data[0].ValidTill = moment(success.data[0].ValidTill, "YYYY-MM-DD").format("DD MMM YYYY");
    $scope.couponData = success.data[0];
  }, function(error){

  });


  // FETCHIG THE RELATED COUPONS BY BRAND NAME
  getInfoFactory.getRelatedCoupons($routeParams.id, 'coupon').then(function(result){
      if(result.status == 200){
        $scope.relatedCoupons = result.data.slice();
      }
  });


  $scope.couponClickEvent = function(coupon){
    if(jQuery("#couponInput")){
      var couponText = jQuery("#couponInput").val();
      var $temp = $("<input>");
      $("body").append($temp);
      $temp.val(couponText).select();
      document.execCommand("copy");
      $temp.remove();
      jQuery("#dealButton").html("Copied");
    }

    window.open(coupon.Url);
  }

}]);
