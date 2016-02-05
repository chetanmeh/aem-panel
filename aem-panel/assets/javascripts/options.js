function OptionsCtrl($scope) {

  $scope.options = JSON.parse(localStorage.getItem('aempanel.options'));

  $scope.$watch('options', function(value) {
    localStorage.setItem('aempanel.options', JSON.stringify(value));
	}, true);
};
