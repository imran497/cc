angular.module("cc", ["ngRoute", "ngSanitize", "viewhead"])
.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
        title: 'Coupon Crown',
        templateUrl: '/views/home.ejs',
        controller: 'homeController'
    })
    .when('/coupons/brand/:brandName', {
        title: 'Brand Coupons',
        templateUrl: '/views/coupons_by_brand_name.ejs',
        controller: 'couponsByBrandNameController'
    })
    .when('/coupons/category/:category', {
        title: 'Category coupons',
        templateUrl: '/views/coupons_by_category.ejs',
        controller: 'couponsByCategoryController'
    })
    .when('/coupons/coupon/:id', {
        title: 'Coupon',
        templateUrl: '/views/single_coupon.ejs',
        controller: 'singleCouponController'
    })
    .when('/profile/my-profile', {
        title: 'My Profile',
        templateUrl: '/views/profile/user_profile.ejs',
        controller: 'userProfileController'
    })
    .when('/profile/wallet', {
        title: 'My Wallet',
        templateUrl: '/views/profile/wallet.ejs',
        controller: 'walletController'
    })
    .when('/authenticate/activateReset', {
        title: 'Reset Password',
        templateUrl: '/views/profile/reset_password.ejs',
        controller: 'resetPasswordController'
    })
    .when('/about/aboutus', {
        title: 'About Us',
        templateUrl: '/views/about/about_us.ejs'
    })
    .when('/about/policy', {
        title: 'Policy',
        templateUrl: '/views/about/policy.ejs'
    })
    .when('/about/termsandconditions', {
        title: 'Terms & Conditions',
        templateUrl: '/views/about/terms_and_conditions.ejs'
    })
    .when('/coupons/search/:searchItem', {
        title: 'Search',
        templateUrl: '/views/coupons_by_search.ejs',
        controller: 'couponsBySearchController'
    })
    .when('/admin', {
        title: 'Admin',
        templateUrl: '/views/admin/admin.ejs',
        controller: 'adminController'
    })
    .when('/deals/today-hot-deals', {
        title: 'Today\'s Best Deals',
        templateUrl: '/views/todayHotDeals.ejs',
        controller: 'todayHotDealsController'
    })
    .otherwise({
        redirecTo: "/"
    });

    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
}])
.run(['$rootScope', '$route', "$location", "$routeParams", function($rootScope, $route, $location, $routeParams) {
    $rootScope.$on('$routeChangeSuccess', function(oVal, nVal) {
      window.scrollTo(0,0);
        if (oVal !== nVal) {
            document.title = $route.current.title;
        }
    });
}]);
