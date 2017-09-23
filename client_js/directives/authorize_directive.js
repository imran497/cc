angular.module("cc")
.directive("modalsDirective", ["$interpolate", "validationsService", "$http", "authenticate","$location","$interval", function($interpolate, validationsService, $http, authenticate, $location, $interval){
  return{
    restrict: "E",
    templateUrl: "/views/prompts.html",
    scope: {

    },
    transclude: true,
    controller: ["$scope", "$attrs", "$element", function($scope, $attrs, $element){
      $scope.show_login_tab = true;
      $scope.show_register_tab = false;
      $scope.show_forgot_password_tab = false;
      $scope.login = new Object();
      $scope.register = new Object();
      $scope.register_error = "";
      $scope.login_error = "";
      $scope.reset_error = "";
      $scope.reset_success_message = "";



      $scope.toggleNavValues = function(id){
        if(id == "show_forgot_password_tab"){
          $scope.show_login_tab = false;
          $scope.show_register_tab = false;
          $scope.show_forgot_password_tab = true;
        }else if(id == "show_register_tab"){
          $scope.show_login_tab = false;
          $scope.show_register_tab = true;
          $scope.show_forgot_password_tab = false;
        }else{
          $scope.show_login_tab = true;
          $scope.show_register_tab = false;
          $scope.show_forgot_password_tab = false;
        }
      }

      $scope.userLogin = function(email, password){
        $scope.login_error = null;
        if(!validationsService.email.test(email)){
          $scope.login_error = "Please Enter a valid Email Id";
        }else{
          var login_creds = new Object();
          login_creds.email = email;
          login_creds.password = password;
          authenticate.login(login_creds).then(function(success){
            if(success.status == 200){
              window.location.href = "/";
            }else{
              $scope.login_error = success.data;
            }
          },
          function(error){
            $scope.login_error = "Login Failed. Contact support or try later";
          });
        }
      }

      $scope.userRegister = function(name, register_email, password, confirm_password, mobile){
        $scope.register_error = null;
        if(!validationsService.nameReg.test(name) || name === null || name === "" || name === undefined){
          $scope.register_error = "Please Enter a valid Name";
        }
        else if(!validationsService.email.test(register_email)){
          $scope.register_error = "Please Enter a valid Email Id";
        }
        else if(password != confirm_password){
          $scope.register_error = "Passwords donot match";
        }
        else if(!validationsService.mobile.test(mobile)){
          $scope.register_error = "Please Enter a valid MobileNo";
        }
        else{
          var register_details = new Object();
          register_details.name = name;
          register_details.email = register_email;
          register_details.password = password;
          register_details.mobile = mobile;
          authenticate.register(register_details).then(function(success){
            if(success.status == 200){
              window.location.href = "/";
            }else{
              $scope.register_error = success.data;
            }
          },
          function(error){
            $scope.register_error = "Please Try later";
          });
        }

      }

      $scope.forgotPassword = function(reset_email){
        $scope.reset_error = null;
        $scope.reset_success_message = null;
        var intervalPromise;
        if(!validationsService.email.test(reset_email)){
          $scope.reset_error = "Please Enter a valid Email Id";
        }else{
          $scope.reset_success_message = "Please wait";
          intervalPromise = $interval(function(){
            $scope.reset_success_message += ".";
          }, 1000);
          authenticate.resetPassword(reset_email).then(function(success){
            $interval.cancel(intervalPromise);
            if(success.status == 200){
              $scope.reset_success_message = success.data;
            }else{
              $scope.reset_success_message = null;
              $scope.reset_error = success.data;
            }
          }, function(error){
            $scope.reset_error = "Unable to send Reset Link. Contact Support or Try Later";
          });
        }
      }

      jQuery(document).ready(function(){
        jQuery("#login_form").on("keydown", function(event){
          if(event.keyCode == 13){
              jQuery("#login_form #btn-login").trigger("click");
          }
        });

        jQuery("#register_form").on("keydown", function(event){
          if(event.keyCode == 13){
            jQuery("#register_form #btn-register").trigger("click");
          }
        });

        jQuery("#reset_form").on("keydown", function(event){
          if(event.keyCode == 13){
            jQuery("#reset_form #btn-forgotpwd").trigger("click");
          }
        });
      });

    }]
  }
}]);
