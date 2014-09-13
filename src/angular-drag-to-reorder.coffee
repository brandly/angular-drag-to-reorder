angular.module('mb-dragToReorder', [])
.directive('dragToReorder', [ ->
  link: (scope, element, attrs) ->
    unless scope[attrs.dragToReorder]?
      throw 'Must specify the list to reorder'
    ###
      drag stuff
    ###

    draggingClassName = 'dragging'
    element.attr 'draggable', true

    element.on 'dragstart', (e) ->
      element.addClass draggingClassName
      e.dataTransfer.setData 'text/plain', scope.$index

    element.on 'dragend', ->
      element.removeClass draggingClassName

    ###
      drop stuff
    ###

    droppingClassName = 'dropping'
    droppingAboveClassName = 'dropping-above'
    droppingBelowClassName = 'dropping-below'

    dragOverHandler = (e) ->
      e.preventDefault()
      offsetY = e.offsetY or e.layerY

      # above halfway
      if offsetY < (@offsetHeight / 2)
        element.removeClass droppingBelowClassName
        element.addClass droppingAboveClassName
      # below
      else
        element.removeClass droppingAboveClassName
        element.addClass droppingBelowClassName

    dropHandler = (e) ->
      e.preventDefault()
      droppedItemIndex = parseInt e.dataTransfer.getData('text/plain'), 10
      theList = scope[attrs.dragToReorder]

      newIndex = null
      # dropping item above us
      if element.hasClass droppingAboveClassName
        if droppedItemIndex < scope.$index
          # dropped item was already above us,
          # so now it'll be one index above
          newIndex = scope.$index - 1
        else
          # since it's moving from below to above us,
          # it'll need to take our index
          newIndex = scope.$index

      # dropping item below us
      else
        if droppedItemIndex < scope.$index
          # moving above to below
          newIndex = scope.$index
        else
          # still below
          newIndex = scope.$index + 1

      itemToMove = theList[droppedItemIndex]
      # moving down the list
      if newIndex > droppedItemIndex
        # move all items below it...
        for i in [droppedItemIndex...newIndex] by 1
          # ...up one spot
          theList[i] = theList[i + 1]

      # moving up the list
      else if newIndex < droppedItemIndex
        for i in [droppedItemIndex...newIndex] by -1
          theList[i] = theList[i - 1]

      # put it in its new home
      theList[newIndex] = itemToMove
      # let angular rearrange the DOM
      scope.$apply ->
        # and let em know
        scope.$emit 'dragToReorder.reordered',
          array: theList
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
