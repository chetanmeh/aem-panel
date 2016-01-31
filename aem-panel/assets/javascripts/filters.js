angular.module('AEMPanel', [])
  .directive('ngHtml', function() {
    return function(scope, element, attrs) {
      scope.$watch(attrs.ngHtml, function(value) {
        element[0].innerHTML = value;
      });
    }
  }).
  filter('sanitize', function() {
    return function(input) {
      return input;/*.
        replace(/&/g, '&amp;').
        replace(/</g, '&lt;').
        replace(/>/g, '&gt;');*/
    }
  }).
  filter('ansi2html', function() {
    return function(input) {
      return input;
      //return ansi2html(input);
    }
});
