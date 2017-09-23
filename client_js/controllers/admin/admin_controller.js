angular.module("cc")
.controller("adminController", ["$scope", "$http", function($scope, $http){

  $scope.init = function(){
    var password = prompt("Enter Password for Admin page");
    $http.post("/admin/password", {password: password}, {headers:{"Content-Type": "application/json"}}).then(function(success){
      if(success.status == 200){
        
      }else if(success.status == 404){
        alert("Incorrect Password");
        window.location.href = "/";
      }
    }, function(error){
      alert("Try later");
      window.location.href = "/";
    });
    /*if(password == "admin"){

    }else{
      alert("Wrong Password");
      window.location.href = "/";
    }*/
  }

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
}]);
