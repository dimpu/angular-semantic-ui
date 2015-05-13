'use strict';

angular.module('angularify.semantic.radio', [])
.controller('RadioCtrl', ['$scope', function ($scope) {
    var self = this;
    this.options = [];
    this.addOption = function(opt){
        this.options.push(opt);
    };
    this.selectOption = function(option){
        angular.forEach(self.options, function(opt){
            opt.ele.children().children()[0].removeAttribute('checked');
        });
        option.ele.children().children()[0].setAttribute('checked', 'true');
        $scope.model=option.value;
    };
}])
.directive('radioGroup', [function () {
    return {
        restrict: 'E',
        transclude: 'true',
        replace: true,
        controllerAs:'rctrl',
        controller:'RadioCtrl',
        scope:{
            variant:"@",
            model:"=ngModel",
            inline:"=isInline"
        },
        template:'<div class="grouped fields" data-ng-class="{\'inline\':inline}" ng-transclude>'+
                 '</div>',
        link: function (scope, ele, attrs,RadioCtrl) {
            RadioCtrl.model = scope.model;
        }
    };
}])
.directive('radioOption', function () {
    return {
        restrict: 'E',
        require:'^radioGroup',
        transclude: 'true',
        replace: 'true',
        scope :{
            value:"@"
        },
        template:  '<div class="field">'+
                   '<div class="ui radio checkbox" data-ng-class="variant">' +
                    ' <input type="radio" name="model">'        +
                    ' <label ng-transclude></label>' +
                    '</div>'+
                    '</div>',
        link: function(scope, ele, attrs, RadioCtrl) {
            scope.checked =   !!scope.checked;
            scope.ele = ele;
            RadioCtrl.addOption(scope);
            //
            // Click handler
            //
            ele.on('click', function () { 
                scope.$apply(function(){
                    RadioCtrl.selectOption(scope);
                });
        
            });
        }
    }
});




