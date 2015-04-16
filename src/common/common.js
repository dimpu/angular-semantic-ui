angular.module('angularify.semantic.common', [])
.directive('dropdown',['$timeout',function($timeout){
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {
            $timeout(function(){
                $('.dropdown').dropdown();    
            });
        }
    }
}])
.directive('checkbox',['$timeout',function($timeout){
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {
            $timeout(function(){
                $('.checkbox').checkbox();    
            });
        }
    }
}]);

