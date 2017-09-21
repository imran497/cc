angular.module("cc")
.factory("getInfoFactory", ["$rootScope", "$http", function($rootScope, $http){
  var getInfo = new Object();

  getInfo.getConfig = function(){
    var getConfigPromise = $http.get("/data/config.json", function(data, error){
      if(error){
        return(error);
      }
      else{
        return(data);
      }
    });

    return getConfigPromise;
  }

  getInfo.getTopBrandsFromDb = function(data){
    var getTopBrandsFromDbPromise = $http.post('coupons/getTopBrands', data, {headers: {"Content-Type": "application/json"}})
    .then(function(brandData, brandError){
      if(brandError){
        return brandError;
      }
      else{
        return brandData;
      }
    });
    return getTopBrandsFromDbPromise;
  }

  getInfo.getAllBrandsFromDb = function(){
    var getAllBrandsFromDbPromise = $http.post('coupons/getAllBrands')
    .then(function(allBrandData, allBrandError){
      if(allBrandError){
        return allBrandError;
      }
      else{
        return allBrandData;
      }
    });
    return getAllBrandsFromDbPromise;
  }

  getInfo.getAllCategoriesForBrandFromDb = function(currentBrand){
    var getAllCategoriesForBrandFromDbPromise = $http.post('coupons/getAllCategoriesForFilter', {brandNameForFilter: currentBrand})
    .then(function(allCategoriesData, allCategoriesError){
      if(allCategoriesError){
        return allCategoriesError;
      }
      else{
        return allCategoriesData;
      }
    });
    return getAllCategoriesForBrandFromDbPromise;
  }

  getInfo.getAllBrandsForCategoryFromDb = function(currentCategory){
    var getAllCategoriesForBrandFromDbPromise = $http.post('coupons/getAllBrandsForFilter', {categoryForFilter: currentCategory})
    .then(function(allCategoriesData, allCategoriesError){
      if(allCategoriesError){
        return allCategoriesError;
      }
      else{
        return allCategoriesData;
      }
    });
    return getAllCategoriesForBrandFromDbPromise;
  }

  getInfo.getTopCategoriesFromDb = function(data){
    var getTopCategoriesFromDbPromise = $http.post('coupons/getTopCategories', data, {headers: {"Content-Type": "application/json"}})
    .then(function(categoriesData, categoriesError){
      if(categoriesError){
        return categoriesError;
      }
      else{
        return categoriesData;
      }
    });
    return getTopCategoriesFromDbPromise;
  }

  getInfo.getTopCategoryCouponsFromDb = function(categoryId){
    var getTopCategoryCouponsFromDbPromise = $http.post('coupons/getTopCategoryCoupons', {categoryId: categoryId}, {headers: {"Content-Type": "application/json"}})
    .then(function(categoryCouponData, categoryCouponError){
      if(categoryCouponError){
        return categoryCouponError;
      }
      else{
        return categoryCouponData;
      }
    });
    return getTopCategoryCouponsFromDbPromise;
  }

  getInfo.getCouponsByBrandName = function(brandName){
    var url = "/coupons/brand/"+brandName;
    var getCouponsByBrandNamePromise = $http.post(url)
    .then(function(couponsByBrandNameData, couponsByBrandNameError){
      if(couponsByBrandNameError){
        return couponsByBrandNameError;
      }
      else{
        return couponsByBrandNameData;
      }
    });
    return getCouponsByBrandNamePromise;
  }

  getInfo.getCouponsByCategory = function(category){
    var url = "/coupons/category/"+category;
    var getCouponsByCategoryePromise = $http.post(url)
    .then(function(couponsByCategoryData, couponsByCategoryError){
      if(couponsByCategoryError){
        return couponsByCategoryError;
      }
      else{
        return couponsByCategoryData;
      }
    });
    return getCouponsByCategoryePromise;
  }

  getInfo.getCouponsWithFilter = function(brands, categories){
    var getCouponsWithFilterPromise = $http.post("coupons/getCouponsWithFilter")
    .then(function(getCouponsWithFilterData, getCouponsWithFilterError){
      if(getCouponsWithFilterError){
        return getCouponsWithFilterError;
      }else{
        return getCouponsWithFilterData;
      }
    });
    return getCouponsWithFilterPromise;
  }

  getInfo.getSingleCoupon = function(id){
    var getSingleCouponPromise = $http.post("coupons/coupon/"+id)
    .then(function(getSingleCouponData, getSingleCouponError){
      if(getSingleCouponError){
        return getSingleCouponError;
      }else{
        return getSingleCouponData;
      }
    });
    return getSingleCouponPromise;
  }

  getInfo.getUserProfile = function(){
    var getUserProfilePromise = $http.post("/profile/my-profile")
    .then(function(getUserProfileData, getUserProfileError){
      if(getUserProfileError){
        return getUserProfileError;
      }else{
        return getUserProfileData;
      }
    });
    return getUserProfilePromise;
  }

  getInfo.getUserWallet = function(){
    var getUserWalletPromise = $http.post("/profile/wallet")
    .then(function(getUserWalletData, getUserWalletError){
      if(getUserWalletError){
        return getUserWalletError;
      }else{
        return getUserWalletData;
      }
    });
    return getUserWalletPromise;
  }

  getInfo.getRelatedBrands = function(filter, type){
    var filterData = new Object();
    filterData.type = type;
    filterData.filter = filter;
    var getRelatedBrandsPromise = $http.post("/coupons/getRelatedBrands", {filterData: filterData}, {headers: {"Content-Type": "application/json"}})
    .then(function(getRelatedBrandsData, getRelatedBrandsError){
      if(getRelatedBrandsError){
        return getRelatedBrandsError;
      }else{
        return getRelatedBrandsData;
      }
    });
    return getRelatedBrandsPromise;
  }

  getInfo.getRelatedCoupons = function(parameter, type){
    var relatedData = new Object();
    relatedData.type = type;
    relatedData.parameter = parameter;
    var getRelatedCouponsPromise = $http.post("/coupons/getRelatedCoupons", {relatedData: relatedData}, {headers: {"Content-Type": "application/json"}})
    .then(function(getRelatedCouponsData, getRelatedCouponsError){
      if(getRelatedCouponsError){
        return getRelatedCouponsError;
      }else{
        return getRelatedCouponsData;
      }
    });
    return getRelatedCouponsPromise;
  }

  getInfo.getCouponsBySearch = function(searchItem){
    var getCouponsBySearchPromise = $http.post("coupons/search/"+searchItem)
    .then(function(getCouponsBySearchData, getCouponsBySearchError){
      if(getCouponsBySearchError){
        return getCouponsBySearchError;
      }else{
        return getCouponsBySearchData;
      }
    });
    return getCouponsBySearchPromise;
  }

  getInfo.getTrendingCoupons = function(data){
    var getTrendingCouponsPromise = $http.post("coupons/trendingCoupons", data)
    .then(function(getTrendingCouponsData, getTrendingCouponsError){
      if(getTrendingCouponsError){
        return getTrendingCouponsError;
      }else{
        return getTrendingCouponsData;
      }
    });
    return getTrendingCouponsPromise;
  }

  return getInfo;
}]);
