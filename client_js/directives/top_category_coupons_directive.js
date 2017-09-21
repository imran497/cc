angular.module("cc")
.directive("topCategoryCoupons", ["$rootScope", "getInfoFactory", function($rootScope, getInfoFactory){
  return{
    restrict: "E",
    templateUrl: "/views/top_category_coupons.ejs",
    replace: true,
    scope: {

    },
    controller: ["$scope", "$attrs", "$element", function($scope, $attrs, $element){

      $scope.topCategories = new Array();
      getInfoFactory.getConfig().then((result, error) => {
        if(error){
          console.log(error);
        }
        else{
          getInfoFactory.getTopCategoriesFromDb(result.data).then((dbResult, dbError) => {
            if(dbError){
              console.log(dbError);
            }else{
              console.log(dbResult.data);
              $scope.topCategories = dbResult.data.slice();
            }
          });

          getInfoFactory.getTopCategoryCouponsFromDb(result.data['topCategories'][0]).then((dbResult, dbError) => {
            if(dbError){
              console.log(dbError);
            }else{
              $scope.topCategoryCoupons = dbResult.data.slice();
            }
          });
        }
      });

      $scope.changeTopCategoryCoupons = function(categoryId){
        getInfoFactory.getTopCategoryCouponsFromDb(categoryId).then((dbResult, dbError) => {
          if(dbError){
            console.log(dbError);
          }else{
            $scope.topCategoryCoupons = dbResult.data.slice();
          }
        });
      }


    }]
  }
}]);
