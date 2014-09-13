(function() {
  var demo;

  demo = angular.module('demo', ['mb-dragToReorder']);

  demo.controller('BasicListCtrl', function($scope) {
    $scope.planets = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
    return $scope.$on('dragToReorder.reordered', function($event, reordered) {
      return console.log("Moved " + reordered.item + " from " + reordered.from + " to " + reordered.to);
    });
  });

}).call(this);
