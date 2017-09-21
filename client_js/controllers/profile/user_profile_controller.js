angular.module("cc")
.controller("userProfileController", ["$scope","getInfoFactory", "updateInfoFactory", "validationsService", function($scope, getInfoFactory, updateInfoFactory, validationsService){

  $scope.editUserDetails = false;
  $scope.userData = new Array();
  $scope.edit_error = null;
  $scope.edit_success = null;

  getInfoFactory.getUserProfile().then(function(success){
    $scope.userData = success.data;
  }, function(error){

  });

  $scope.editUserDetailsFunc = function(){
    $scope.editUserDetails = !$scope.editUserDetails;
  }

  $scope.saveUserDetailsFunc = function(){
    $scope.edit_error = null;
    $scope.edit_success = null;

    if(!validationsService.nameReg.test($scope.userData.name) || $scope.userData.name === null || $scope.userData.name === "" || $scope.userData.name === undefined){
      $scope.edit_error = "Please Enter a valid Name";
    }
    else if(!validationsService.email.test($scope.userData.email)){
      $scope.edit_error = "Please Enter a valid Email Id";
    }
    else if(!validationsService.mobile.test($scope.userData.mobile)){
      $scope.edit_error = "Please Enter a valid MobileNo";
    }
    else if($scope.userData.dob === undefined || $scope.userData.dob === null){
      $scope.edit_error = "Please Select DOB";
    }
    else{
      $scope.edit_error = null;
      $scope.edit_success = null;
      $scope.userData['dob'] = moment($scope.userData['dob']).format("YYYY-MM-DD");
      updateInfoFactory.updateUserDataDb($scope.userData).then(function(success){
        $scope.editUserDetails = !$scope.editUserDetails;
        $scope.edit_success = "Data Updated";
      }, function(error){
        $scope.edit_error = "Data Update failed. Try later";
      });
    }


  }

}]);
