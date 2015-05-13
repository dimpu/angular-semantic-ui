/* globals _:false */
'use strict';
angular.module('angularify.semantic.wizard', [])

.controller('WizardController', ['$scope',
    function($scope) {
        $scope.steps = [];
        this.getSetpsLength = function(){
            return $scope.steps.length;
        };
        this.addStep = function (step) {
            $scope.steps.push(step);
            if ($scope.steps.length === 1) {
                $scope.goTo($scope.steps[0]);
            }else{
                $scope.goTo($scope.steps[$scope.currentStepIndex]);
            }
        };

        $scope.goTo = function (step) {
            unselectAll();
            $scope.selectedStep = step;
            step.selected = true;
        };

        function unselectAll() {
            $scope.steps.forEach(function (step) {
                step.selected = false;
            });
            $scope.selectedStep = null;
        }

        this.next = function () {
            var index = $scope.steps.indexOf($scope.selectedStep);
            $scope.selectedStep.completed = true;
            if (index === $scope.steps.length - 1) {
                this.finish();
            } else {
                $scope.goTo($scope.steps[index + 1]);
            }
        };

        this.goTo = function (step) {
            var stepTo;

            if (angular.isNumber(step)) {
                stepTo = $scope.steps[step];
            } else {
                stepTo = $scope.steps.filter(function (step) {
                    return step.title === step;
                })[0];
            }
            $scope.goTo(stepTo);
        };

        this.finish = function() {
            if ($scope.onFinish) {
                $scope.selectedStep.completed = true;
                $scope.onFinish();
            }
        };

        this.cancel = this.previous = function() {
            var index = $scope.steps.indexOf($scope.selectedStep);
            if (index === 0) {
                throw new Error('Cant go back. Its already in step 0');
            } else {
                $scope.goTo($scope.steps[index - 1]);
            }
        };

        $scope.getStatus = function (step) {
          var statusClass = [];
          if (step.selected)
            statusClass.push('active');
          if (!step.selected && !step.completed)
            statusClass.push('disabled');
          if (step.completed)
            statusClass.push('completed');
          return statusClass;
        };
    }
])
    .directive('wizard', function() {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            scope: {
                currentStepIndex:'=',
            },
            controller: 'WizardController',
            template: '<div>' + 
                        '<div class="ui steps small">' + 
                          '<div class="ui step" ng-repeat="step in steps" ng-click="step.completed && goTo(step)" ng-class="getStatus(step)">' + 
                            '{{step.title}}' + 
                          '</div>' + 
                        '</div>' + 
                        '<div class="ui hidden divider"></div>' +
                        '<div ng-transclude></div>' + 
                      '</div>',
            link: function(scope, element, attrs, WizardController) {
                //link function
            }
        };
    })
    .directive('wizardPane', function() {
        return {
            restrict: 'EA',
            replace: true,
            transclude: true,
            require: '^wizard',
            controller: 'WizardController',
            scope: {
                title: '@'
            },
            template: '<div class="ui segment" ng-transclude ng-show="selected" ng-style="noMargin"></div>',
            link: function(scope, element, attrs, WizardController) {

                WizardController.addStep(scope);
            }
        };
    });

function wizardButtonDirective(action) {
    angular.module('angularify.semantic.wizard')
        .directive(action, function () {
            return {
                restrict: 'A',
                replace: false,
                require: '^wizard',
                link: function ($scope, $element, $attrs, wizard) {
                    if(action == "wzPrevious" && wizard.getSetpsLength() <=0){
                        $element.hide();
                    }
                    $scope.noMargin = { margin: 0 };
                    $element.on('click', function (e) {
                        e.preventDefault();
                        $scope.$apply(function () {
                            $scope.$eval($attrs[action]);
                            wizard[action.replace('wz', '').toLowerCase()]();
                        });
                    });
                }
            };
        });
}

wizardButtonDirective('wzNext');
wizardButtonDirective('wzPrevious');
wizardButtonDirective('wzFinish');
wizardButtonDirective('wzCancel');
