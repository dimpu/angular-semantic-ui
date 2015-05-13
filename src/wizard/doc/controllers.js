
angular
  .module('dropdownApp', ['angularify.semantic.wizard'])
  .controller('RootCtrl', RootCtrl);

function RootCtrl ($scope) {
    $scope.currentStep = 'Step2';
  
  $scope.callme = function (form) {
    console.log('finished');
  }

  $scope.onNext= function(form_data){
  	console.log(form_data);
  }
}

