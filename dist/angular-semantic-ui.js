angular.module('angularify.semantic', ['angularify.semantic.accordion',
	                                   'angularify.semantic.checkbox',
	                                   'angularify.semantic.dimmer',
	                                   'angularify.semantic.dropdown',
	                                   'angularify.semantic.modal',
	                                   'angularify.semantic.popup',
	                                   'angularify.semantic.rating',
	                                   'angularify.semantic.sidebar',
	                                   'angularify.semantic.wizard',
	                                   'angularify.semantic.common',
	                                   'angularify.semantic.datetimepicker']);

'use strict';

angular.module('angularify.semantic.accordion', [])

.controller('AccordionController', ['$scope', function($scope){
    $scope.accordions = [];

    this.add_accordion = function(scope) {
        $scope.accordions.push(scope);
        
        var _this = this;
        scope.$on('$destroy', function (event) {
            _this.remove_accordion(scope);
        });
        
        return $scope.accordions;
    }

    this.closeAll = function(scope) {
        var i = 0;
        var isCloseAll = false;

        var index = $scope.accordions.indexOf(scope);

        for (i in $scope.accordions){
            if ($scope.accordions[i].close)
                isCloseAll = true;
        }

        if (isCloseAll == true){
            for (i in $scope.accordions){
                if (i !== index) {
                    $scope.accordions[i].active = false;
                }
            }

            return true;
        }

        return false;

    }

    this.remove_accordion = function(scope) {
      var index = $scope.accordions.indexOf(scope);
      if ( index !== -1 ) {
        $scope.accordions.splice(index, 1);
      }
    }

    this.is_close_all = function() {
        var i = 0;
        
        for (i in $scope.accordions){
            if ($scope.accordions[i].close == 'true')
                return true;
        }
        return false;
    }
}])

.directive('accordion', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        controller: 'AccordionController',
        scope: {
            'close': '@'
        },
        template: "<div class=\"ui accordion\" ng-transclude></div>",
        link: function(scope, element, attrs, AccordionController) {
            AccordionController.add_accordion(scope);
        }
    }
})

.directive('accordionGroup', function() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope : {
            title:  '@',
            open: '@'
        },
        require:'^accordion',
        template: "<div class=\"ui accordion\">\
                   <div class=\"title\" ng-class=\"{ active: active }\" ng-click=\"click_on_accordion_tab()\"> \
                     <i class=\"dropdown icon\"></i> \
                     {{ title }} \
                   </div> \
                   <div class=\"content\"  ng-class=\"{ active: active }\" ng-transclude> \
                   </div> \
                   </div>",

        link: function(scope, element, attrs, AccordionController) {

            // set up active
            scope.active = attrs.open === 'true';
            
            // Add the accordion to the controller
            AccordionController.add_accordion(scope);

            // Click handler
            scope.click_on_accordion_tab = function(){
                
                // class all first of all
                AccordionController.closeAll(scope);
                
                // Swap the active state
                scope.active = !scope.active;
            }
        }
    }
});

'use strict';

angular.module('angularify.semantic.checkbox', [])

.directive('checkbox', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope :{
            type: "@",
            size: "@",
            checked: "@",
            model: '=ngModel'
        },
        template: "<div class=\"{{checkbox_class}}\">" +
                    "<input type=\"checkbox\">"        +
                    "<label ng-click=\"click_on_checkbox()\" ng-transclude></label>" +
                    "</div>",
        link: function(scope, element, attrs, ngModel) {

            //
            // set up checkbox class and type
            //
            if (scope.type == 'standard' || scope.type == undefined){
                scope.type = 'standard';
                scope.checkbox_class = 'ui checkbox';
            } else if (scope.type == 'slider'){
                scope.type = 'slider';
                scope.checkbox_class = 'ui slider checkbox';
            } else if (scope.type == 'toggle'){
                scope.type = 'toggle';
                scope.checkbox_class = 'ui toggle checkbox';
            } else {
                scope.type = 'standard';
                scope.checkbox_class = 'ui checkbox';
            }

            //
            // set checkbox size
            //
            if (scope.size == 'large'){
                scope.checkbox_class = scope.checkbox_class + ' large';
            } else if (scope.size == 'huge') {
                scope.checkbox_class = scope.checkbox_class + ' huge';
            }

            //
            // set checked/unchecked
            //
            if (scope.checked == 'false' || scope.checked == undefined) {
                scope.checked = false;
            } else {
                scope.checked = true;
                element.children()[0].setAttribute('checked', '');
            }

            //
            // Click handler
            //
            element.bind('click', function () {
                scope.$apply(function() {
                    if (scope.checked == true){
                        scope.checked = true;
                        scope.model   = false;
                        element.children()[0].removeAttribute('checked');
                    } else {
                        scope.checked = true;
                        scope.model   = true;
                        element.children()[0].setAttribute('checked', 'true');
                    }
                })
            });

            //
            // Watch for ng-model
            //
            scope.$watch('model', function(val){
                if (val == undefined)
                    return;

                if (val == true){
                    scope.checked = true;
                    element.children()[0].setAttribute('checked', 'true');
                } else {
                    scope.checked = false;
                    element.children()[0].removeAttribute('checked');
                }
            });
        }
    }
});
'use strict';

angular.module('angularify.semantic.dimmer', [])

.directive("pageDimmer", function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope : {
            show : "=?",
            model: '=ngModel'
        },
        template: "<div class=\"{{dimmer_class}}\" ng-click=\"click_on_dimmer()\">" +
                    "<div class=\"content\">" +
                      "<div class=\"center\" ng-transclude></div>" +
                    "</div>" +
                  "</div>",
        link : function(scope, element, attrs, ngModel) {

            if (scope.show == true) {
                scope.dimmer_class = 'ui page active dimmer';
            }
            else {
                scope.show = false;
                scope.dimmer_class = 'ui page disable dimmer';
            }

            //
            // Click on dimmer handler
            //
            scope.click_on_dimmer = function(){
                scope.model = false;
                scope.dimmer_class = 'ui page dimmer';
            }

            //
            // Watch for the ng-model changing
            //
            scope.$watch('model', function(val){
                if (val == false || val == undefined)
                    return;
                else
                    scope.dimmer_class = 'ui page active dimmer';
            });
        }
    };
});

'use strict';

angular.module('angularify.semantic.dropdown', [])
    .controller('DropDownController', ['$scope',
        function ($scope) {
            $scope.items = [];

            this.add_item = function (scope) {
                $scope.items.push(scope);
                return $scope.items;
            };

            this.remove_item = function (scope) {
                var index = $scope.items.indexOf(scope);
                if (index !== -1)
                    $scope.items.splice(index, 1);
            };

            this.update_title = function (title) {
                for (var i in $scope.items) {
                    $scope.items[i].title = title;
                }
            };

        }
    ])

.directive('dropdown', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        controller: 'DropDownController',
        scope: {
            title: '@',
            open: '@',
            model: '=ngModel'
        },
        template: '<div class="{{ dropdown_class }}">' +
                    '<div class="default text">{{ title }}</div>' +
                    '<i class="dropdown icon"></i>' +
                    '<div class="{{ menu_class }}"  ng-transclude>' +
                    '</div>' +
                '</div>',
        link: function (scope, element, attrs, DropDownController) {
            scope.dropdown_class = 'ui selection dropdown';
            scope.menu_class = 'menu transition hidden';
            scope.original_title = scope.title;

            if (scope.open === 'true') {
                scope.is_open = true;
                scope.dropdown_class = scope.dropdown_class + ' active visible';
                scope.menu_class = scope.menu_class + ' visible';
            } else {
                scope.is_open = false;
            }
            DropDownController.add_item(scope);

            /*
             * Watch for title changing
             */
            scope.$watch('title', function (val, oldVal) {
                if (val === undefined || val === oldVal || val === scope.original_title)
                    return;

                scope.model = val;
            });

            /*
             * Watch for ng-model changing
             */
            scope.$watch('model', function (val) {
                // update title or reset the original title if its empty
                scope.model = val;
                DropDownController.update_title(val || scope.original_title);
            });

            /*
             * Click handler
             */
            element.bind('click', function () {
                if (scope.is_open === false) {
                    scope.$apply(function () {
                        scope.dropdown_class = 'ui selection dropdown active visible';
                        scope.menu_class = 'menu transition visible';
                    });
                } else {
                    if (scope.title !== scope.original_title)
                        scope.model = scope.title;
                    scope.$apply(function () {
                        scope.dropdown_class = 'ui selection dropdown';
                        scope.menu_class = 'menu transition hidden';
                    });
                }
                scope.is_open =! scope.is_open;
            });
        }
    };
})

.directive('dropdownGroup', function () {
    return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        require: '^dropdown',
        scope: {
            title: '=title'
        },
        template: '<div class="item" ng-transclude >{{ item_title }}</div>',
        link: function (scope, element, attrs, DropDownController) {

            // Check if title= was set... if not take the contents of the dropdown-group tag
            // title= is for dynamic variables from something like ng-repeat {{variable}}
            if (scope.title === undefined) {
                scope.item_title = element.children()[0].innerHTML;
            } else {
                scope.item_title = scope.title;
            }

            //
            // Menu item click handler
            //
            element.bind('click', function () {
                DropDownController.update_title(scope.item_title);
            });
        }
    };
});

'use strict';

angular.module('angularify.semantic.modal', [])

.directive('modal', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        require: 'ngModel',
        template: '<div class="ui modal" ng-transclude></div>',
        link: function (scope, element, attrs, ngModel) {          
          element.modal({
            onHide: function () {
              ngModel.$setViewValue(false);
            }
          });
          scope.$watch(function () {
            return ngModel.$modelValue;
          }, function (modelValue){
            element.modal(modelValue ? 'show' : 'hide');
          });
        }
    }
});

'use strict';

angular.module('angularify.semantic.popup', [])

.directive('popup', function ($document) {
    return {
        restrict: "A",
        scope : {
            popup : "@"
        },
        link: function(scope, element, attrs) {
            var class_name = '';
            // convert to json
            var popup_meta_data = eval('(' + scope.popup + ')');
            
            var title = popup_meta_data['title'];
            if (title == undefined)
                title = '';
            
            var content = popup_meta_data['content'];
            if (content == undefined)
                content = '';
            
            var position = popup_meta_data['position'];
            if (position == undefined)
                position = 'top';

            var size = popup_meta_data['size'];
            if (size == undefined)
                size = 'small';
            
            if (position == 'left') {
                class_name = 'ui popup left center transition visible ' + size;
            } else if (position == 'right') {
                class_name = 'ui popup right center transition visible ' + size;
            } else if (position == 'bottom') {
                class_name = 'ui popup bottom center transition visible ' + size;
            } else {
                class_name = 'ui popup top center transition visible ' + size;
            }

            //
            // Get element X/Y of left corner
            //
            function getPos(ele){
                    var x = 0;
                    var y = 0;
                    while(true){
                        x += ele.offsetLeft;
                        y += ele.offsetTop;
                        if(ele.offsetParent === null)
                            break;
                        ele = ele.offsetParent;
                    }
                    return [x, y];
            }

            var current_element_position_top_left = getPos(element[0]);
            var current_element_height = element[0].offsetHeight;
            var current_element_width  = element[0].offsetWidth;

            //
            // Remove element by class name
            //
            NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
                for(var i = 0, len = this.length; i < len; i++) {
                    if(this[i] && this[i].parentElement) {
                        this[i].parentElement.removeChild(this[i]);
                    }
                }
            }

            //
            // Handle mouse over
            //
            element.bind('mouseenter', function(){
                var html = '<div id="my-popup" class="' + class_name + '" style=""><div class="header">' + title +'</div><div class="content">' + content + '</div></div>';

                angular.element(element[0]).append(html);

                var popupHeight = document.getElementById('my-popup').clientHeight;
                var popupWidth  = document.getElementById('my-popup').clientWidth;

                if (position == 'left') {
                    document.getElementById('my-popup').style.top = current_element_position_top_left[1] + (current_element_height / 2) - (popupHeight / 2) + 'px';
                    document.getElementById('my-popup').style.right = 'auto';
                    document.getElementById('my-popup').style.left = current_element_position_top_left[0] - popupWidth - 10 + 'px';
                    document.getElementById('my-popup').style.bottom = 'auto';
                    document.getElementById('my-popup').style.display = 'inline-block';
                } else if (position == 'right') {
                    document.getElementById('my-popup').style.top = current_element_position_top_left[1] + (current_element_height /  2) - (popupHeight / 2) + 'px';
                    document.getElementById('my-popup').style.right = 'auto';
                    document.getElementById('my-popup').style.left = current_element_position_top_left[0] + current_element_width + 'px';
                    document.getElementById('my-popup').style.bottom = 'auto';
                    document.getElementById('my-popup').style.display = 'inline-block';
                } else if (position == 'bottom') {
                    document.getElementById('my-popup').style.top = current_element_position_top_left[1] + current_element_height + 'px';
                    document.getElementById('my-popup').style.left = current_element_position_top_left[0] + (current_element_width / 2) - (popupWidth / 2) + 15 + 'px';
                    document.getElementById('my-popup').style.right = 'auto';
                    document.getElementById('my-popup').style.bottom = 'auto';
                    document.getElementById('my-popup').style.display = 'inline-block';
                } else {
                    document.getElementById('my-popup').style.top = current_element_position_top_left[1] - popupHeight - 10 + 'px';
                    document.getElementById('my-popup').style.left = current_element_position_top_left[0] + (current_element_width / 2) - (popupWidth / 2) + 18 + 'px';
                    document.getElementById('my-popup').style.right = 'auto';
                    document.getElementById('my-popup').style.bottom = 'auto';
                    document.getElementById('my-popup').style.display = 'inline-block';
                }
            });

            //
            // Handle mouse leave
            //
            element.bind('mouseleave', function(){
                document.getElementsByClassName("ui popup bottom center transition visible").remove();
                if (document.getElementById('my-popup') !== null)
                    document.getElementById('my-popup').remove();
            });
        }
    }
});
'use strict';

angular.module('angularify.semantic.sidebar', [])
.directive('sidebar', function () {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        template: '<div class="ui sidebar" ng-transclude></div>',
        scope: {
            buttonClass : '='
        },
        link: function(scope, element, attrs){
            debugger;
            element.sidebar('attach events', scope.buttonClass);
        }
    }
});

'use strict';

angular.module('angularify.semantic.rating', [])

.directive('rating', function(){
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        scope: {
            id: "@",
            size: "@",
            type: "@",
            model : '=ngModel'
        },
        template: '<div class={{div_class}}>' + 
                     '<i id="{{id + 1}}" class="{{icon_class}}" ng-click="click(1)" ng-mouseenter="mouse_enter(1)" ng-mouseleave="mouse_leave(1)"></i>' +
                     '<i id="{{id + 2}}" class="{{icon_class}}" ng-click="click(2)" ng-mouseenter="mouse_enter(2)" ng-mouseleave="mouse_leave(2)"></i>' +
                     '<i id="{{id + 3}}" class="{{icon_class}}" ng-click="click(3)" ng-mouseenter="mouse_enter(3)" ng-mouseleave="mouse_leave(3)"></i>' +
                     '<i id="{{id + 4}}" class="{{icon_class}}" ng-click="click(4)" ng-mouseenter="mouse_enter(4)" ng-mouseleave="mouse_leave(4)"></i>' +
                     '<i id="{{id + 5}}" class="{{icon_class}}" ng-click="click(5)" ng-mouseenter="mouse_enter(5)" ng-mouseleave="mouse_leave(5)"></i>' +
                   '</div>',
        link: function(scope, element, attrs){
            if (scope.model == undefined)
                scope.model = 0;

            if (scope.model < 1 && scope.model > 5)
                scope.model = 0;

            // is rating already checked
            var checked = false;
            
            //
            // Set up icon type
            //
            if (scope.type == undefined)
                scope.type = 'star';

            //
            // Set up size
            //
            if (scope.size == undefined) 
                scope.div_class = 'ui rating ' + scope.type;
            else if (scope.size == 'small')
                scope.div_class = 'ui small ' + scope.type + ' rating';
            else if (scope.size == 'large')
                scope.div_class = 'ui large ' + scope.type + ' rating';
            else if (scope.size == 'huge')
                scope.div_class = 'ui huge ' + scope.type + ' rating';

            //
            // set up icon class
            //
            scope.icon_class = 'icon';

            //
            // Handle mouse enter
            //
            scope.mouse_enter = function(icon_index){
                if (checked == true)
                    return;

                var i = 1;
                for (i; i <= icon_index; i++){
                    document.getElementById(scope.id + i).className = 'icon active';
                }

                return;
            };

            //
            // Handle mouse leave
            //
            scope.mouse_leave = function(icon_index){
                if (checked == true)
                    return;

                var i = 1;
                for (i; i <= 5; i++){
                    document.getElementById(scope.id + i).className = 'icon';
                }

                return;
            };

            //
            // Handle click
            //
            scope.click = function(icon_index, mode){
                var i = 1;
                for (i; i <= icon_index; i++){
                    document.getElementById(scope.id + i).className = 'icon active';
                }

                if (icon_index !== 0)
                    checked = true;

                return;
            };

            //
            // Watch for model
            //
            scope.$watch('model', function(val){
                scope.click(val);
            });
        }
    };
});

/* globals _:false */
'use strict';
angular.module('angularify.semantic.wizard', [])

.controller('WizardController', ['$scope',
    function($scope) {
        $scope.steps = [];
        $scope.currentStep = null;
        $scope.stepsLength = '';
        
        $scope.$watch('currentStep', function (step) {
            if (!step) return;
            var stepTitle = $scope.selectedStep.title;
            if ($scope.selectedStep && stepTitle !== $scope.currentStep) {
                $scope.goTo($scope.steps.filter(function (step) {
                    return step.title ==- $scope.currentStep;
                })[0]);
            }
        });

        $scope.$watch('[editMode, steps.length]', function () {
            var editMode = $scope.editMode;
            if (editMode === undefined || editMode === null) return;

            if (editMode) {
                $scope.steps.forEach(function (step) {
                    step.completed = true;
                });
            }
        }, true);

        this.addStep = function (step) {
            $scope.steps.push(step);
            if ($scope.steps.length === 1) {
                $scope.goTo($scope.steps[0]);
            }
        };

        $scope.goTo = function (step) {
            unselectAll();
            $scope.selectedStep = step;
          
            if ($scope.currentStep !== undefined) {
                $scope.currentStep = step.title;
            }
          
            step.selected = true;
            $scope.$emit('wizard:stepChanged', {
                step: step,
                index: $scope.steps.indexOf(step)
            });
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
                fullwidth: "@",
                currentStep: '=?',
                onFinish: '&',
                editMode: '=',
                name: '@'
            },
            controller: 'WizardController',
            template: '<div>' + 
                        '<div class="ui steps {{stepsLength}} small">' + 
                          '<div class="ui step" ng-repeat="step in steps" ng-click="step.completed && goTo(step)" ng-class="getStatus(step)">' + 
                            '{{step.title}}' + 
                          '</div>' + 
                        '</div>' + 
                        '<div class="ui hidden divider"></div>' +
                        '<div ng-transclude></div>' + 
                      '</div>',
            link: function(scope, element, attrs, WizardController) {
                if (scope.fullwidth === 'true') {
                    var widthmatrix = {
                        0: '',
                        1: 'one',
                        2: 'two',
                        3: 'three',
                        4: 'four',
                        5: 'five',
                        6: 'six',
                        7: 'seven',
                        8: 'eight',
                        9: 'nine',
                        10: 'ten'
                    };
                    scope.stepsLength = widthmatrix[scope.steps.length];
                }

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


'use strict';

angular.module('angularify.semantic.datetimepicker', [])
  .constant('dateTimePickerConfig', {
    dropdownSelector: null,
    minuteStep: 5,
    minView: 'minute',
    startView: 'day'
  })
  .directive('datetimepicker', ['dateTimePickerConfig', function (defaultConfig) {
    "use strict";

    var validateConfiguration = function (configuration) {
      var validOptions = ['startView', 'minView', 'minuteStep', 'dropdownSelector'];

      for (var prop in configuration) {
        if (configuration.hasOwnProperty(prop)) {
          if (validOptions.indexOf(prop) < 0) {
            throw ("invalid option: " + prop);
          }
        }
      }

      // Order of the elements in the validViews array is significant.
      var validViews = ['minute', 'hour', 'day', 'month', 'year'];

      if (validViews.indexOf(configuration.startView) < 0) {
        throw ("invalid startView value: " + configuration.startView);
      }

      if (validViews.indexOf(configuration.minView) < 0) {
        throw ("invalid minView value: " + configuration.minView);
      }

      if (validViews.indexOf(configuration.minView) > validViews.indexOf(configuration.startView)) {
        throw ("startView must be greater than minView");
      }

      if (!angular.isNumber(configuration.minuteStep)) {
        throw ("minuteStep must be numeric");
      }
      if (configuration.minuteStep <= 0 || configuration.minuteStep >= 60) {
        throw ("minuteStep must be greater than zero and less than 60");
      }
      if (configuration.dropdownSelector !== null && !angular.isString(configuration.dropdownSelector)) {
        throw ("dropdownSelector must be a string");
      }
    };

    return {
      restrict: 'E',
      require: 'ngModel',
      template: "<div class='field'>"+
        "      <div class='ui action input'>"+
        "        <input type='text' placeholder='pick a date' data-ng-model='ngModel'>"+
        "        <div class='ui icon button' data-ng-click='showDateTimePicker()'>"+
        "          <i class='calendar icon'></i>"+
        "        </div>"+
        "      </div><div class='datetimepicker transition hidden'>" +
        "<table class='ui  unstackable celled striped table'>" +
        "   <thead>" +
        "       <tr>" +
        "           <th class='left'" +
        "               data-ng-click='changeView(data.currentView, data.leftDate, $event)'" +
        "               ><i class='ui icon arrow left'/></th>" +
        "           <th class='switch ui center aligned' colspan='5'" +
        "               data-ng-click='changeView(data.previousView, data.currentDate, $event)'" +
        ">{{ data.title }}</th>" +
        "           <th class='floated right aligned'" +
        "               data-ng-click='changeView(data.currentView, data.rightDate, $event)'" +
        "             ><i class='ui icon arrow right'/></th>" +
        "       </tr>" +
        "       <tr>" +
        "           <th class='dow' data-ng-repeat='day in data.dayNames' >{{ day }}</th>" +
        "       </tr>" +
        "   </thead>" +
        "   <tbody>" +
        "       <tr data-ng-class='{ hide: data.currentView == \"day\" }' >" +
        "           <td colspan='7'  >" +
        "           <div class='class='ui horizontal list'>"+
        "              <span  class='ui basic button' style='width:110px;margin-bottom:5px' ng-class='{{ data.currentView }}' " +
        "                       data-ng-repeat='dateValue in data.dates'  " +
        "                       data-ng-class='{active: dateValue.active, past: dateValue.past, future: dateValue.future}' " +
        "                       data-ng-click=\"changeView(data.nextView, dateValue.date, $event)\">{{ dateValue.display }}</span> </div>" +
        "           </td>" +
        "       </tr>" +
        "       <tr data-ng-show='data.currentView == \"day\"' data-ng-repeat='week in data.weeks'>" +
        "           <td data-ng-repeat='dateValue in week.dates' " +
        "               data-ng-click='changeView(data.nextView, dateValue.date, $event)'" +
        "               class='day' " +
        "               data-ng-class='{active: dateValue.active, past: dateValue.past, future: dateValue.future}' >{{ dateValue.display }}</td>" +
        "       </tr>" +
        "   </tbody>" +
        "</table></div></div>",
      scope: {
        ngModel: "=",
        onSetTime: "&"
      },
      replace: true,
      link: function (scope, element, attrs) {

        var directiveConfig = {};

        if (attrs.datetimepickerConfig) {
          directiveConfig = scope.$eval(attrs.datetimepickerConfig);
        }

        var configuration = {};

        angular.extend(configuration, defaultConfig, directiveConfig);

        validateConfiguration(configuration);

        var dataFactory = {
          year: function (unixDate) {
            var selectedDate = moment.utc(unixDate).startOf('year');
            // View starts one year before the decade starts and ends one year after the decade ends
            // i.e. passing in a date of 1/1/2013 will give a range of 2009 to 2020
            // Truncate the last digit from the current year and subtract 1 to get the start of the decade
            var startDecade = (parseInt(selectedDate.year() / 10, 10) * 10);
            var startDate = moment.utc(selectedDate).year(startDecade - 1).startOf('year');
            var activeYear = scope.ngModel ? moment(scope.ngModel).year() : 0;

            var result = {
              'currentView': 'year',
              'nextView': configuration.minView === 'year' ? 'setTime' : 'month',
              'title': startDecade + '-' + (startDecade + 9),
              'leftDate': moment.utc(startDate).subtract(9, 'year').valueOf(),
              'rightDate': moment.utc(startDate).add(11, 'year').valueOf(),
              'dates': []
            };

            for (var i = 0; i < 12; i++) {
              var yearMoment = moment.utc(startDate).add(i, 'years');
              var dateValue = {
                'date': yearMoment.valueOf(),
                'display': yearMoment.format('YYYY'),
                'past': yearMoment.year() < startDecade,
                'future': yearMoment.year() > startDecade + 9,
                'active': yearMoment.year() === activeYear
              };

              result.dates.push(dateValue);
            }

            return result;
          },

          month: function (unixDate) {

            var startDate = moment.utc(unixDate).startOf('year');

            var activeDate = scope.ngModel ? moment(scope.ngModel).format('YYYY-MMM') : 0;

            var result = {
              'previousView': 'year',
              'currentView': 'month',
              'nextView': configuration.minView === 'month' ? 'setTime' : 'day',
              'currentDate': startDate.valueOf(),
              'title': startDate.format('YYYY'),
              'leftDate': moment.utc(startDate).subtract(1, 'year').valueOf(),
              'rightDate': moment.utc(startDate).add(1, 'year').valueOf(),
              'dates': []
            };

            for (var i = 0; i < 12; i++) {
              var monthMoment = moment.utc(startDate).add(i, 'months');
              var dateValue = {
                'date': monthMoment.valueOf(),
                'display': monthMoment.format('MMM'),
                'active': monthMoment.format('YYYY-MMM') === activeDate
              };

              result.dates.push(dateValue);
            }

            return result;
          },

          day: function (unixDate) {

            var selectedDate = moment.utc(unixDate);
            var startOfMonth = moment.utc(selectedDate).startOf('month');
            var endOfMonth = moment.utc(selectedDate).endOf('month');

            var startDate = moment.utc(startOfMonth).subtract(Math.abs(startOfMonth.weekday()), 'days');

            var activeDate = scope.ngModel ? moment(scope.ngModel).format('YYYY-MMM-DD') : '';

            var result = {
              'previousView': 'month',
              'currentView': 'day',
              'nextView': configuration.minView === 'day' ? 'setTime' : 'hour',
              'currentDate': selectedDate.valueOf(),
              'title': selectedDate.format('YYYY-MMM'),
              'leftDate': moment.utc(startOfMonth).subtract(1, 'months').valueOf(),
              'rightDate': moment.utc(startOfMonth).add(1, 'months').valueOf(),
              'dayNames': [],
              'weeks': []
            };


            for (var dayNumber = 0; dayNumber < 7; dayNumber++) {
              result.dayNames.push(moment.utc().weekday(dayNumber).format('dd'));
            }

            for (var i = 0; i < 6; i++) {
              var week = { dates: [] };
              for (var j = 0; j < 7; j++) {
                var monthMoment = moment.utc(startDate).add((i * 7) + j, 'days');
                var dateValue = {
                  'date': monthMoment.valueOf(),
                  'display': monthMoment.format('D'),
                  'active': monthMoment.format('YYYY-MMM-DD') === activeDate,
                  'past': monthMoment.isBefore(startOfMonth),
                  'future': monthMoment.isAfter(endOfMonth)
                };
                week.dates.push(dateValue);
              }
              result.weeks.push(week);
            }

            return result;
          },

          hour: function (unixDate) {
            var selectedDate = moment.utc(unixDate).hour(0).minute(0).second(0);

            var activeFormat = scope.ngModel ? moment(scope.ngModel).format('YYYY-MM-DD H') : '';

            var result = {
              'previousView': 'day',
              'currentView': 'hour',
              'nextView': configuration.minView === 'hour' ? 'setTime' : 'minute',
              'currentDate': selectedDate.valueOf(),
              'title': selectedDate.format('ll'),
              'leftDate': moment.utc(selectedDate).subtract(1, 'days').valueOf(),
              'rightDate': moment.utc(selectedDate).add(1, 'days').valueOf(),
              'dates': []
            };

            for (var i = 0; i < 24; i++) {
              var hourMoment = moment.utc(selectedDate).add(i, 'hours');
              var dateValue = {
                'date': hourMoment.valueOf(),
                'display': hourMoment.format('LT'),
                'active': hourMoment.format('YYYY-MM-DD H') === activeFormat
              };

              result.dates.push(dateValue);
            }

            return result;
          },

          minute: function (unixDate) {
            var selectedDate = moment.utc(unixDate).minute(0).second(0);

            var activeFormat = scope.ngModel ? moment(scope.ngModel).format('YYYY-MM-DD H:mm') : '';

            var result = {
              'previousView': 'hour',
              'currentView': 'minute',
              'nextView': 'setTime',
              'currentDate': selectedDate.valueOf(),
              'title': selectedDate.format('lll'),
              'leftDate': moment.utc(selectedDate).subtract(1, 'hours').valueOf(),
              'rightDate': moment.utc(selectedDate).add(1, 'hours').valueOf(),
              'dates': []
            };

            var limit = 60 / configuration.minuteStep;

            for (var i = 0; i < limit; i++) {
              var hourMoment = moment.utc(selectedDate).add(i * configuration.minuteStep, 'minute');
              var dateValue = {
                'date': hourMoment.valueOf(),
                'display': hourMoment.format('LT'),
                'active': hourMoment.format('YYYY-MM-DD H:mm') === activeFormat
              };

              result.dates.push(dateValue);
            }

            return result;
          },

          setTime: function (unixDate) {
            var tempDate = new Date(unixDate);
            var newDate = new Date(tempDate.getTime() + (tempDate.getTimezoneOffset() * 60000));

            scope.ngModel = newDate;

            if (configuration.dropdownSelector) {
              jQuery(configuration.dropdownSelector).dropdown('toggle');
            }
            scope.showDateTimePicker();
            scope.onSetTime({ newDate: newDate, oldDate: scope.ngModel });

            return dataFactory[configuration.startView](unixDate);
          }
        };

        var getUTCTime = function () {
          var tempDate = (scope.ngModel ? moment(scope.ngModel).toDate() : new Date());
          return tempDate.getTime() - (tempDate.getTimezoneOffset() * 60000);
        };
       
       scope.showDateTimePicker = function(){
          $('.datetimepicker').transition('swing down');
       };


        scope.changeView = function (viewName, unixDate, event) {
          if (event) {
            event.stopPropagation();
            event.preventDefault();
          }

          if (viewName && (unixDate > -Infinity) && dataFactory[viewName]) {
            scope.data = dataFactory[viewName](unixDate);
          }
        };

        scope.changeView(configuration.startView, getUTCTime());

        scope.$watch('ngModel', function () {
          scope.changeView(scope.data.currentView, getUTCTime());
        });
      }
    };
  }]);