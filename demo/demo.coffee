demo = angular.module 'demo', ['mb-dragToReorder']

demo.controller 'BasicListCtrl', ($scope) ->
  $scope.planets = [
    'Mercury', 'Venus', 'Earth', 'Mars',
    'Jupiter', 'Saturn', 'Uranus', 'Neptune'
  ]

  $scope.$on 'dragToReorder.reordered', ($event, reordered) ->
    console.log "Moved #{reordered.item} from #{reordered.from} to #{reordered.to}"
