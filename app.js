(function () {
'use strict';

angular.module('NarrowItDownApp',[])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective)
.directive('itemsLoaderIdicator', ItemsLoaderIdicatorDirective)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");


function FoundItemsDirective() {
  var ddo = {
    restrict: 'E',
    templateUrl: 'foundItems.template.html',
    scope: {
      foundItems: '<',
      onRemove: '&'
    }
  };
  return ddo;
}

function ItemsLoaderIdicatorDirective() {
  var ddo = {
    restrict: 'E',
    templateUrl: 'loader/itemsloaderidicator.template.html',
    scope: {
      showItemLoaderIndicator: '< '
    },
    link: ItemsLoaderIdicatorDirectiveLink
  };
  return ddo;
}

function ItemsLoaderIdicatorDirectiveLink(scope, element, attrs, controller) {
  scope.$watch('showItemLoaderIndicator', function (newValue, oldValue){
    if (newValue === true) {
      showItemLoaderIndicator();
    } else {
      hideItemsLoaderIndicator();
    }
  });

  function showItemLoaderIndicator(){
    element.find("div").css('display', 'block');
  }

  function hideItemsLoaderIndicator(){
    element.find("div").css('display', 'none');
  }

}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var menu = this;
  menu.searchTerm = "";
  menu.found = [];
  menu.showItemLoaderIndicator = false;

  menu.narrowItDown = function () {
    menu.showItemLoaderIndicator = true;
    if (menu.searchTerm){
      MenuSearchService.getMatchedMenuItems(menu.searchTerm).then(function (result) {
        menu.found = result;
        menu.showItemLoaderIndicator = false;
      });
    }else {
      menu.found = [];
      menu.showItemLoaderIndicator = false;
    }
  }

  menu.removeItem = function (itemIndex){
    menu.found.splice(itemIndex, 1);
  };
}


MenuSearchService.$inject = ['$http', 'ApiBasePath']
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {
    // process result and only keep items that match
    return $http.get(ApiBasePath + "/menu_items.json").then(function (result) {
      // return processed items
    return result.data.menu_items.filter(item => item.description.toLowerCase().indexOf(searchTerm) !== -1);
  });
}
}

})();
