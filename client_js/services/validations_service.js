angular.module("cc")
.service("validationsService", ["$rootScope", function($rootScope){
  this.email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  this.nameReg = /^[a-zA-Z\s]+$/;
  this.mobile = /^[789]\d{9}$/;
  this.password = /^(?=.*[0-9])(?=.*[a-zA-z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
}]);
