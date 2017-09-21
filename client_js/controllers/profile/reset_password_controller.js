angular.module("cc")
.controller("resetPasswordController", ["$scope", "$routeParams", "$http", "validationsService", function($scope, $routeParams, $http, validationsService){

  $scope.reset_error = "";
  $scope.reset_success = "";
  $scope.resetPassword = function(password, confirm_password){
    $scope.reset_error = "";
    $scope.reset_success = "";

    if(!validationsService.password.test(password)){
      $scope.reset_error = "Please Enter a valid Password";
    }else if(password != confirm_password){
        $scope.reset_error = "Passwords didn't match";
    }else{
      var user_details = new Object();

      user_details.password = password;
      user_details.user = $routeParams.token;

      $http.post("/authenticate/resetPassword", {user_details: user_details}, {headers: {"Content-Type": "application/json"}})
      .then(function(success){
        if(success.status == 200){
          $scope.reset_success = success.data;
        }
        else if(success.status == 200){
          $scope.reset_error = success.data;
        }
        else{
          $scope.reset_error = "Failed to update Password";
        }

      }, function(error){
        $scope.reset_error = "Failed to update Password";
      });
    }
  }

}]);
