angular.module("cc")
.controller("walletController", ["$scope","getInfoFactory", function($scope, getInfoFactory){

  $scope.walletData = new Array();
  getInfoFactory.getUserWallet().then(function(success){
    for(var i = 0, len = success.data.length; i < len; i++){
      success.data[i].transactionDate = moment(success.data[i].transactionDate).format("DD MMM YY")
    }
    $scope.walletData = success.data.slice();
  }, function(error){
    $scope.walletData = false;
  });
}]);
