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
    minView: 'day',
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

            scope.ngModel = moment(newDate).format('YYYY-MM-DD');

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