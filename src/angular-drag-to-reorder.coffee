angular.module('mb-dragToReorder', [])
.directive('dragToReorder', [ ->
  scope:
    dragToReorder: '='
  link: (scope, element, attrs) ->
    ###
      drag stuff
    ###

    handle = if attrs.dragHandle then angular.element(element[0].getElementsByClassName(attrs.dragHandle)) else element
    draggingClassName = 'dragging'
    handle.attr 'draggable', true

    handle.on 'dragstart', (e) ->

      e.dataTransfer.setDragImage(element[0],0,0)

      element.addClass draggingClassName
      
      # let angular rearrange the DOM
      scope.$apply ->
        # and let em know
        scope.$emit 'dragToReorder.dragstart',
          item: scope.dragToReorder[scope.$parent.$index],
          from: scope.$parent.$index,

      e.dataTransfer.setData 'text/plain', scope.$parent.$index

    handle.on 'dragend', ->

      # let angular rearrange the DOM
      scope.$apply ->
        # and let em know
        scope.$emit 'dragToReorder.dragend'

      element.removeClass draggingClassName

    ###
      drop stuff
    ###

    droppingClassName = 'dropping'
    droppingAboveClassName = 'dropping-above'
    droppingBelowClassName = 'dropping-below'

    dragOverHandler = (e) ->
      e = e or window.event;
      e.preventDefault()
      offsetY = e.pageY
      hoveredElementY = @offsetTop - @scrollTop + @clientTop;

      # above halfway
      if offsetY < hoveredElementY+(@offsetHeight / 2)
        element.removeClass droppingBelowClassName
        element.addClass droppingAboveClassName
      # below
      else
        element.removeClass droppingAboveClassName
        element.addClass droppingBelowClassName

    dropHandler = (e) ->
      e.preventDefault()
      droppedItemIndex = parseInt e.dataTransfer.getData('text/plain'), 10

      newIndex = null
      # dropping item above us
      if element.hasClass droppingAboveClassName
        if droppedItemIndex < scope.$parent.$index
          # dropped item was already above us,
          # so now it'll be one index above
          newIndex = scope.$parent.$index - 1
        else
          # since it's moving from below to above us,
          # it'll need to take our index
          newIndex = scope.$parent.$index

      # dropping item below us
      else
        if droppedItemIndex < scope.$parent.$index
          # moving above to below
          newIndex = scope.$parent.$index
        else
          # still below
          newIndex = scope.$parent.$index + 1

      itemToMove = scope.dragToReorder[droppedItemIndex]

      # remove it from the list
      scope.dragToReorder.splice droppedItemIndex, 1
      # put it in its new home
      scope.dragToReorder.splice newIndex, 0, itemToMove
      
      # let angular rearrange the DOM
      scope.$apply ->
        # and let em know
        scope.$emit 'dragToReorder.reordered',
          item: itemToMove
          from: droppedItemIndex
          to: newIndex

      # cleanup
      element.removeClass droppingClassName
      element.removeClass droppingAboveClassName
      element.removeClass droppingBelowClassName
      element.off 'drop', dropHandler

    element.on 'dragenter', (e) ->
      # make sure we're not dropping on the dragged element
      return if element.hasClass draggingClassName

      element.addClass droppingClassName
      element.on 'dragover', dragOverHandler
      element.on 'drop', dropHandler

    element.on 'dragleave', (e) ->
      element.removeClass droppingClassName
      element.removeClass droppingAboveClassName
      element.removeClass droppingBelowClassName
      element.off 'dragover', dragOverHandler
      element.off 'drop', dropHandler
])
