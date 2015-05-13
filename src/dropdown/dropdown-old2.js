'use strict';

angular.module('angularify.semantic.dropdown', ['ngAnimate'])
    .controller('DropDownController', ['$scope',
        function ($scope) {
            var self= this;
            var dropdown_class =  ($scope.isSearch)?'ui selection dropdown search':
                                    ($scope.isMulti)?'ui selection dropdown multiple':
                                    ($scope.isSearch && $scope.isMulti)?'ui selection dropdown search multiple':'ui selection dropdown';
            $scope.dropdown_class = dropdown_class;
            $scope.menu_class = 'menu transition hidden';


            this.items = [];
            this.selected_items = [];

            this.parent_scope = {};
            $scope.multiItems =[];
            this.add_item = function (scope) {
                self.items.push(scope);
                return self.items;
            };

            this.remove_item = function (item) {
                var index = $scope.items.indexOf(scope);
                if (index !== -1)
                    self.items.splice(index, 1);
            };

            this.update_item= function(item_label,item_value){
                $scope.itemLabel = item_label;
                $scope.model = item_value;
               
                if($scope.isMulti){ 
                    self.selected_items.push(item_value);
                    $scope.multiItems.push({
                        label:item_label,
                        value:item_value
                    });

                    // $scope.multiItems.push(item_label);
                    $scope.model= self.selected_items.join(',');
                    self.filterMulti();
                }
            };
            
            this.show_menu = function(){
                $scope.showDefaultText = false;
                $scope.dropdown_class = dropdown_class +' active visible';                        
                $scope.menu_class = 'menu transition visible flipInX animated';
            };
            this.hide_menu = function(){
                $scope.showDefaultText = true;
                
                $scope.dropdown_class = dropdown_class;
                $scope.menu_class = 'menu transition hidden ';
            };
            this.filterMulti = function(){
                angular.forEach(self.items, function(item){
                    item.itemClasses ='';
                });
                
                self.items.filter(function (item) {
                    $scope.multiItems.forEach(function(label){
                        if(item.itemLabel == label){
                            item.itemClasses ='filtered'
                        }
                    });
                    
                });
            };
            this.onFilter = function(value){
                angular.forEach(self.items, function(item){
                    item.itemClasses ='';

                });
                if(value != undefined){
                    $scope.itemLabel = '';
                }
                self.items.filter(function (item) {
                    if(item.itemLabel.match(new RegExp(value,"gi")) > -1){
                        item.itemClasses ='filtered'
                        // item.filtered = true;
                    }
                });

            };
        }
    ])
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
              // to address @blesh's comment, set attribute value to 'false'
              // on blur event:
              ele.bind('blur', function() {
                 scope.$apply(model.assign(scope, false));
              });

        }
    };
}])
.directive('dropdown', ['$document',function ($document) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        controller: 'DropDownController',
        scope: {
            itemLabel: '@',
            model: '=ngModel',
            isSearch:'=',
            isMulti:'='
        },
        template: '<div class="{{ dropdown_class }}">' +
                    '<i class="dropdown icon"></i>'+
                    '<a class="ui label transition visible" data-ng-show="isMulti" ng-repeat="item in multiItems track by $index">'+
                        '{{item.label}}<i class="delete icon" data-ng-click="removeItem(item)"></i>'+
                    '</a>'+
                    '<input type="search" focus-me="searchFocus" data-ng-change="defaultTextClass=false" data-ng-focus="showMenu()" class="search" data-ng-model="searchTerm" tabindex="0" data-ng-show="isSearch" >'+
                    '<div class="text" data-ng-class="defaultTextClass" data-ng-show="showDefaultText">{{ itemLabel }}</div>' +
                    '<div class="{{ menu_class }}"  ng-transclude>' +
                    '</div>' +
                '</div>',
        link: function (scope, element, attrs, DropDownController) {
            
            scope.defaultTextClass ='default';
            scope.showDefaultText = true;
            scope.defaultItemLabel = angular.copy(scope.itemLabel);
            
            scope.removeItem = function(item){
                DropDownController.remove_item(item);
            };

            scope.$watch('searchTerm', function (val, oldVal) {
                if(scope.isSearch)
                    DropDownController.onFilter(val);
            });
            
            scope.$watch('itemLabel',function(val){
                if(val != scope.defaultItemLabel){
                    scope.defaultTextClass ='';
                }
            })
            /*
             * Watch for ng-model changing
             */
            scope.$watch('model', function (val) { 
                // update item_label or reset the original item_label if its empty
                scope.model = val;
                // DropDownController.update_value(val || scope.original_item_label);
            });
            scope.showMenu = function(){

                DropDownController.show_menu();
                // scope.menu_class = 'menu transition visible flipInX animated';
            };

            element.on('click',function(e){
                e.stopPropagation(); 
                scope.searchFocus = true;
                
                scope.$apply(function(){
                    if(!scope.is_open){
                        DropDownController.show_menu();
                    } else {
                        DropDownController.hide_menu();
                    }
                });
               
                scope.is_open =! scope.is_open;
            });
            $document.on('click',function(){ 
                if(scope.is_open){ 
                    scope.$apply(function(){
                        DropDownController.hide_menu();   
                    });                    
                    scope.is_open=!scope.is_open;
                }
            });

            DropDownController.parent_scope= scope;
        }
    };
}])

.directive('dropdownItem', function () {
    return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        require: '^dropdown',
        scope: {},
        // controller: 'DropDownController',
        template: '<div class="item" ng-transclude data-value={{itemValue}} data-ng-class="itemClasses" >{{ item_label }}</div>',
        link: function (scope, ele, attrs, DropDownController) {
            scope.itemLabel = attrs.itemLabel || ele.children()[0].innerHTML;
            scope.itemValue = attrs.itemValue || scope.itemLabel; 
            DropDownController.add_item(scope);
            //
            // Menu item click handler
            //
            ele.on('click', function (e) {    
                e.stopPropagation();   
                console.log(DropDownController.parent_scope);
                if(!DropDownController.parent_scope.isMulti){ 
                    DropDownController.hide_menu();
                }         
                DropDownController.update_item(scope.itemLabel,scope.itemValue);
            });
        }
    };
});
