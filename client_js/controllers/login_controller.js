angular.module("cc")
.controller("loginController", ["$scope", "$http", "getInfoFactory", "$routeParams", function($scope, $http, getInfoFactory, $routeParams){

  $scope.loggedInValue = jQuery("#loggedInId").val();
  $scope.getBrandList = new Array();
  /*$scope.categories15 = mew Arraay();
  $scope.brands15 = new Array();*/

  $scope.showInputMobile = false;

  $scope.logout = function(){
    $http.get("/authenticate/logout").then(function(success){
      if(success.status == 200){
        window.location.href = "/";
      }
    });
  }

  $http.post("/coupons/getAllBrands").then(function(success){
    if(success.status == 200){
      $scope.getBrandList = success.data.slice();
    }
  }, function(error){

  });

  $scope.searchCoupons = function(){
    if($scope.searchQuery !== null && $scope.searchQuery !== undefined && $scope.searchQuery != ""){
      $http.post("/coupons/chceckBrandExist", {searchQuery: $scope.searchQuery}, {headers: {'Content-Type': 'application/json'}}).then(function(success){
        if(success.status == 200 && success.data.length == 1){
          window.location.href = "/coupons/brand/" + $scope.searchQuery;
        }else{
          window.location.href= "/coupons/search/" + $scope.searchQuery;
        }
      }, function(error){
        console.log(error);
      });
    }
  }

  jQuery(document).ready(function(){
    jQuery("#categoriesAbsoluteHeader").on("mouseenter", function(){
      jQuery("#storesAbsoluteHeaderTarget").slideUp();
      jQuery("#categoriesAbsoluteHeaderTarget").slideDown();
    });

    jQuery("#storesAbsoluteHeader").on("mouseenter", function(){
      jQuery("#categoriesAbsoluteHeaderTarget").slideUp();
      jQuery("#storesAbsoluteHeaderTarget").slideDown();
    });

    jQuery(".my_profile_menu_button").on("click", function(){
      jQuery("#my_profile_menu").slideDown();
    });

    jQuery("header").on("mouseleave", function(){
      jQuery("#categoriesAbsoluteHeaderTarget, #storesAbsoluteHeaderTarget, #my_profile_menu").slideUp();
    });

    jQuery("#searchQueryInput").on("keydown", function(e){
      if(e.keyCode == 13){
        $scope.searchCoupons();
      }
    });

    jQuery(window).scroll(function(){
      if(jQuery(window).scrollTop() > 0){
        jQuery(".brand-name-section").addClass("brandname-f-to-r");
        jQuery(".filter-section").addClass("filter-f-to-r");
        jQuery(".coupons-section").addClass("offset-lg-2");
      }
      else{
        jQuery(".brand-name-section").removeClass("brandname-f-to-r");
        jQuery(".filter-section").removeClass("filter-f-to-r");
        jQuery(".coupons-section").removeClass("offset-lg-2");
      }
    });


    /*$("[list=searchInput]").on('input', function () {
        var val = this.value;
        if($('#searchInput option').filter(function(){
            return this.value === val;
        }).length) {
            //send ajax request
            window.location.href = "/coupons/brand/"+this.value;
        }
    });*/
  });

  $scope.show_leftOverlayPanel = function(){
    jQuery("#Mobile_leftOverlayPanel, #fadeWhiteBg").show();
  }

}]);
