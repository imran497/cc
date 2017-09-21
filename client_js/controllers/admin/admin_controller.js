angular.module("cc")
.controller("adminController", ["$scope", "$http", function($scope, $http){
  $scope.uploadFile = function(){

            var file = $scope.myFile;
            var uploadUrl = "/admin/uploadCouponData";
            var fd = new FormData();
            fd.append('file', file);

            if(file === undefined || file === null){
              $scope.message = "Select file to upload";
            }else{
              $http.post(uploadUrl,fd, {
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}
              })
              .success(function(data){
                jQuery("button").prop("disabled", true);
                $scope.message = data.affectedRows + " Rows inserted";
              })
              .error(function(error){
                $scope.message = "Error. Please try later";
              });
            }
        };
}])
