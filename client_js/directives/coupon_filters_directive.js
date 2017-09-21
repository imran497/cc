angular.module("cc")
.directive("couponFilters", ["$rootScope", "$http", "$routeParams", "getInfoFactory", "$q",  function($rootScope, $http, $routeParams, getInfoFactory, $q){
  return{
    restrict: "E",
    templateUrl: "views/coupon_filters.ejs",
    scope: {
      couponsDisplayed: "="
    },
    controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs ){

      if($routeParams.brandName){

        $scope.categoriesFilterData = new Array();
        getInfoFactory.getAllCategoriesForBrandFromDb($routeParams.brandName).then(
          function(result){
            $scope.categoriesFilterData = result['data'].slice();
          }, function(error){
            //console.log(error);
          });

        $scope.applyFilter = ()=>{
          var categoryFiltersApplied = new Array();
          var defer = $q.defer();
          defer.resolve($("[name=categoryFilterCB]").each(function(){
            if($(this).prop("checked")){
              categoryFiltersApplied.push($(this).val());
            }
          }));
          defer.promise.then(function(){
            $http.post("coupons/getCouponsWithFilter", {brandName: $routeParams['brandName'], categoryFiltersApplied: categoryFiltersApplied}, {headers: {"Content-Type": "application/json"}}).then(
              function(success){
                //console.log(success);
                $scope.couponsDisplayed = success.data;
              },
              function(error){
                //console.log(error);
              }
            )
          });
        }

      }else if($routeParams.category){

        $scope.brandsFilterData = new Array();
        getInfoFactory.getAllBrandsForCategoryFromDb($routeParams.category).then(
          function(result){
            $scope.brandsFilterData = result['data'].slice();
          }, function(error){
            //console.log(error);
          });

        $scope.applyFilter = function(){
          var brandFiltersApplied = new Array();
          var defer = $q.defer();
          defer.resolve($("[name=brandFilterCB]").each(function(){
            if($(this).prop("checked")){
              brandFiltersApplied.push($(this).val());
            }
          }));
          defer.promise.then(function(){
            $http.post("coupons/getCouponsWithFilter", {category: $routeParams['category'], brandFiltersApplied: brandFiltersApplied}, {headers: {"Content-Type": "application/json"}}).then(
              function(success){
                //console.log(success);
                $scope.couponsDisplayed = success.data;
              },
              function(error){
                //console.log(error);
              }
            )
          });
        }

      }



    }]
  }
}]);
