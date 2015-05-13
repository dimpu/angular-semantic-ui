'use strict';

angular.module('angularify.semantic.checkbox', [])

.directive('checkbox', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope :{
            variant: "@",
            trueValue:'@',
            falseValue:'@',
            model: '=ngModel'
        },
        template: '<div class="ui checkbox" data-ng-class="variant">' +
                    '<input type="checkbox">'        +
                    '<label ng-click="click_on_checkbox()" ng-transclude></label>' +
                    '</div>',
        link: function(scope, ele, attrs, ngModel) {
            scope.checked =   !!scope.checked;
            //
            // Click handler
            //
            ele.on('click', function () { 
                scope.$apply(function() {
                    if (scope.checked){ 
                        scope.model   = false;
                        if(scope.falseValue){
                            scope.model= scope.falseValue;
                        }
                        ele.children()[0].removeAttribute('checked');
                    } else {
                        console.log('flase');
                        scope.model   = true;
                        if(scope.trueValue){
                            scope.model= scope.trueValue;
                        }
                        ele.children()[0].setAttribute('checked', 'true');
                    }
                    scope.checked = !scope.checked;
                })
            });
        }
    }
});