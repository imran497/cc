angular.module("cc")
.factory("authenticate", ["$rootScope", "$http", function($rootScope, $http){
  var auth = new Object();

  auth.login = function(login_creds){
    var loginPromise = $http.post("/authenticate/login", {login_creds: login_creds}, {headers: {"Content-Type": "application/json"}}).then(
      function(success){
        return success;
      },
      function(error){
        return error;
      }
    );
    return loginPromise;
  }

  auth.register = function(register_details){
    var registerPromise = $http.post("/authenticate/register", {register_details: register_details}, {headers: {"Content-Type": "application/json"}}).then(
      function(success){
        return success;
      },
      function(error){
        return error;
      }
    );
    return registerPromise;
  }

  auth.resetPassword = function(reset_email){
    var resetPromise = $http.post("/authenticate/forgotpassword", {reset_email: reset_email}, {headers: {"Content-Type": "application/json"}}).then(
      function(success){
        return success;
      },
      function(error){
        return error;
      }
    );
    return resetPromise;
  }

  auth.googleLogin = function(userId){
    var googleLoginPromise = $http.post("/authenticate/googleLogin", {userId: userId}, {headers: {"Content-Type": "application/json"}}).then(
      function(success){
        return success;
      },
      function(error){
        return error;
      }
    );
    return googleLoginPromise;
  }

  return auth;
}]);
