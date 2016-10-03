(function () {
'use strict';

angular.module('NarrowItDownApp',[])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItems)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com/menu_items.json");

NarrowItDownController.$inject = ['MenuSearchService'];
MenuSearchService.$inject = ['$http', 'ApiBasePath'];

function FoundItems() {
  var ddo = {
    restrict: 'E',
    templateUrl: 'foundItems.html',
    scope: {
      foundItems: '<',
      onRemove: '&'
    }
  };
  return ddo;
}

function NarrowItDownController(MenuSearchService) {
  var list = this;
  list.searchTerm = "";
  list.found = [];
  list.showItemLoaderIndicator = false;

  list.narrowItDown = function () {
    list.showItemLoaderIndicator = true;
    if (list.searchTerm){
      MenuSearchService.getMatchedMenuItems(list.searchTerm).then(function (result) {
        list.found = result;
        list.showItemLoaderIndicator = false;
      });
    }else {
      list.found = [];
      list.showItemLoaderIndicator = false;
    }
  }

  list.removeItem = function (itemIndex){
    list.found.splice(itemIndex, 1);
  };
}

function MenuSearchService($http, ApiBasePath) {
   var service = this;
   var items = [];


 service.getMatchedMenuItems = function (searchTerm) {
     return $http({
         method: "GET",
         url: (ApiBasePath)
         }).then(function (result) {
         // process result and only keep items that match
         var fs = [];
         for (var i = 0; i < result.data.menu_items.length; i++) {
           var descr = result.data.menu_items[i].description;
           if ((descr.toLowerCase()).indexOf(searchTerm.toLowerCase()) !== -1) {
             fs.push(result.data.menu_items[i]);
           }
         }

     // return processed items
     return fs;
 });


     };


 }



})();
