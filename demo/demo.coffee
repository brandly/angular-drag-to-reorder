demo = angular.module 'demo', ['mb-dragToReorder']

demo.controller 'BasicListCtrl', ($scope) ->
  $scope.planets = [
    'Mercury', 'Venus', 'Earth', 'Mars',
    'Jupiter', 'Saturn', 'Uranus', 'Neptune'
  ]

  $scope.$on 'dragToReorder.reordered', ($event, reordered) ->
    console.log "Moved #{reordered.item} from #{reordered.from} to #{reordered.to}"

demo.controller 'AdvancedListCtrl', ($scope, $q, $http) ->
  cancelReorder = $q.defer();

  $scope.planets = [
    'Mercury', 'Venus', 'Earth', 'Mars',
    'Jupiter', 'Saturn', 'Uranus', 'Neptune'
  ]

  $scope.$on 'dragToReorder.dragstart', ($event, dragstart) ->
  	# cancel request is POST is not yet completed
    cancelReorder.resolve();
    console.log "Start #{dragstart.item} from #{dragstart.from}"

  $scope.$on 'dragToReorder.reordered', ($event, reordered) ->
    console.log "Moved #{reordered.item} from #{reordered.from} to #{reordered.to}"

  $scope.$on 'dragToReorder.dragend', ($event, dragend) ->
    cancelReorder = $q.defer();
  	# Send POST request to save changes. This request is stopped when 'dragstart' is fired again.
    $http.post 'save.php', {newOrder: $scope.planets}, {timeout:cancelReorder.promise}
    console.log "Dragend"