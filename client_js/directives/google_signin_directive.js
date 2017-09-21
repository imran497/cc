angular.module('cc')
          /*  .controller('MainController',['$scope', function ($scope) {
                $scope.onSignIn=function(response){
                    console.log(response);
                }
            }])*/
            .directive('googleSignInButton',["$http", function($http){
                return {
                    scope:{
                        gClientId:'@',
                        callback: '&onSignIn'
                    },
                    template: '<button ng-click="onSignInButtonClick()" class="btn btn-block btn-danger hover-pointer margin-10-0">Login with Google</button>',
                    controller: ['$scope','$attrs',function($scope, $attrs){
                      jQuery(document).ready(function(){
                        gapi.load('auth2', function() {//load in the auth2 api's, without it gapi.auth2 will be undefined
                            gapi.auth2.init(
                                    {
                                        client_id: $attrs.gClientId
                                    }
                            );
                            var GoogleAuth  = gapi.auth2.getAuthInstance();//get's a GoogleAuth instance with your client-id, needs to be called after gapi.auth2.init
                            $scope.onSignInButtonClick=function(){//add a function to the controller so ng-click can bind to it
                                GoogleAuth.signIn().then(function(response){//request to sign in
                                    //$scope.callback({response:response});
                                    $http.post("/authenticate/googleLogin", {userId: response.getAuthResponse().id_token}, {headers:{"Content-Type":"application/json"}})
                                    .then(function(success){
                                      window.location.href = "/";
                                    }, function(error){
                                      window.location.href = "/";
                                    });
                                });
                            };
                        });
                      });
                    }]
                };
            }]);
