angular.module("cc")
.factory("updateInfoFactory", ["$rootScope", "$http", function($rootScope, $http){
  var updateInfo = new Object();

  updateInfo.updateUserDataDb = function(data){
    var updateUserDataPromise = $http.post('profile/updateUserInfo', data, {headers: {"Content-Type": "application/json"}})
    .then(function(updateUserDataData, updateUserDataError){
      if(updateUserDataError){
        return updateUserDataError;
      }
      else{
        return updateUserDataData;
      }
    });
    return updateUserDataPromise;
  }

  return updateInfo;
}]);
