angular.module("cc")
.controller("footerController", ["$scope", "$http", "getInfoFactory", function($scope, $http, getInfoFactory){

  $scope.topBrands = new Array();
  $scope.topCategories = new Array();
  //FOOTER
  getInfoFactory.getConfig().then(function(success){

    getInfoFactory.getTopBrandsFromDb(success.data).then(function(getTopBrandsFromDbSuccess){
      if(getTopBrandsFromDbSuccess.status == 200){
        $scope.topBrands = getTopBrandsFromDbSuccess.data.slice();
      }
    }, function(getTopBrandsFromDberror){

    });

    getInfoFactory.getTopCategoriesFromDb(success.data).then(function(getTopCategoriesFromDbSuccess){
      if(getTopCategoriesFromDbSuccess.status == 200){
        $scope.topCategories = getTopCategoriesFromDbSuccess.data.slice();
      }
    }, function(getTopCategoriesFromDberror){

    });

  }, function(error){

  });




}]);
