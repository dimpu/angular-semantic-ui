'use strict';

/**
* Semantic DropDown Module
*
* Description
*/
angular.module('angularify.semantic.dropdown', [])
.directive('focusMe', ['$parse','$timeout',function ($parse,$timeout) {
    return {
        restrict: 'A',
        link: function (scope, ele, attrs) {
            var model = $parse(attrs.focusMe);
              scope.$watch(model, function(value) {
                if(value === true) { 
                  $timeout(function() {
                    ele[0].focus(); 
                  });
                }
              });
              ele.bind('blur', function() {
                 scope.$apply(model.assign(scope, false));
              });

        }
    };
}])
.controller('DropDownController', ['$scope', function ($scope) {
	var self= this;
	this.items = [];
	this.filtered_items = [];
    $scope.multiItems =[];
    $scope.model =[];

	$scope.$on('search:label',function(scope,val){
        self.filter_items(val || ''); 
	});
	this.filter_items= function(val){
        self.filtered_items = [];
		angular.forEach(self.items, function(item){
			item.selected =false;
			item.filtered= false;
			if(item.itemLabel.match(new RegExp(val,"gi")) == null){
                item.filtered ='true';
            }else{
                self.filtered_items.push(item);
            }
		});
        if(self.filtered_items.length)
		self.select(self.filtered_items[0]);
	};
	this.select = function(item){
		angular.forEach(self.items, function(item) {
          item.selected = false;
        });
        item.selected = true;
	};
	this.update_select_item = function(item){

		if($scope.isMulti){
            $scope.multiItems.push(item);
            $scope.model.push(item.itemValue);
            
        }else{
            $scope.selectedItemLabel = item.itemLabel;
            $scope.model = item.itemValue;
            self.select(item);
        }
        $scope.searchTerm = '';
	};
    this.remove_select_item = function(item){
        var itemIndex = $scope.multiItems.indexOf(item);
        $scope.multiItems.splice(itemIndex,1);
        $scope.model.splice(itemIndex,1); 
    };
	this.add_item = function(item){
		if (self.items.length === 0) {
          self.select(item);
        }
        self.items.push(item);
	}
}])

.directive('dropdown', ['$document','$sce',function ($document,$sce) {
	return {
		restrict: 'E',
		replace: true,
        transclude: true,
        controllerAs:'ctrl',
        controller: 'DropDownController',
        scope: {
            placeholder: '@',
            model: '=ngModel',
            isSearch:'=',
            isMulti:'='
        },
        template: '<div class="ui selection dropdown" data-ng-class="{\'multiple\':isMulti,\'search\':isSearch,\'active visible\':showMenu}">' +
                    '<i class="dropdown icon"></i>'+
                    '<a class="ui label transition in animating visible" style="-webkit-animation-duration: 200ms" data-ng-show="isMulti" ng-repeat="item in multiItems track by $index">'+
                        '{{item.itemLabel}}<i class="delete icon" data-ng-click="removeSelctItem(item);$event.stopPropagation();"></i>'+
                    '</a>'+
                    '<input type="search" focus-me="searchFocus" data-ng-focus="(showDefaultText=false) && (showMenu=true)" data-ng-blur="searchTextVal.length?showDefaultText=false:showDefaultText=true" class="search" data-ng-model="searchTerm" tabindex="0" data-ng-show="isSearch" >'+
                    '<div class="text" data-ng-class="{\'default\':isDefaultPlaceholder}" data-ng-show="showDefaultText" style="z-index: -1;">{{ selectedItemLabel }}</div>' +
                    '<div class="menu transition animating slide down" style="-webkit-animation-duration: 200ms" data-ng-class="showMenu ? \'visible in\' : \'hidden out\' "  ng-transclude>' +
                    '</div>' +
                '</div>',
        link: function (scope, ele, attrs, DropDownCtrl) {
        	scope.is_open = false;
        	scope.isDefaultPlaceholder = true;
        	scope.showDefaultText = true;
        	scope.selectedItemLabel = scope.placeholder;
        	scope.showMenu = false;
            scope.searchTextVal = '';
            
            scope.removeSelctItem= function(item){
                DropDownCtrl.remove_select_item(item);
                scope.showMenu=false;
            };
        	/*
				on Search chang
        	*/
        	scope.$watch('searchTerm', function(val){
                val = val || '';
                scope.searchTextVal=$sce.trustAsHtml(val);
                if(val.length > 1) {
                    scope.showDefaultText = false;
                    scope.showMenu = true;
                }
                scope.$broadcast('search:label',val); 
        	});
        	scope.$watch('selectedItemLabel',function(val){
        		if(val != scope.placeholder){
        			scope.isDefaultPlaceholder = false;
        		}
        	});
        	ele.on('click',function(e){
        		e.stopPropagation();
                if(scope.isMulti){
                    scope.searchFocus = true;
                }
				scope.$apply(function(){
        			scope.showMenu = !scope.showMenu;
				});
        	});
        	$document.on('click',function(){
        		scope.$apply(function(){
        			scope.showMenu = false;
				});
        	});
        }
		
	};
}])
.directive('dropdownItem', ['$parse',function ($parse) {
	return {
		restrict: 'E',
		require:'^dropdown',
		replace: true,
        transclude: true,
        scope:{},
        template: '<div class="item" ng-transclude data-ng-class="{\'active\':active,\'selected\':selected,\'filtered\':filtered}" >{{ itemLabel }}</div>',
		link: function (scope, ele, attrs, DropDownCtrl) {
			// console.log(attrs);
			scope.itemValue = attrs.itemValue;
			scope.itemLabel = ele.children()[0].innerHTML;
            
			DropDownCtrl.add_item(scope);
			ele.on('click',function(e){
                scope.$apply(function(){
                    e.preventDefault();
                    DropDownCtrl.update_select_item(scope);
                });
                
			});

		}
	};
}])