angular.module('mb-dragToReorder', [])
  .factory('itemBeingDragged', ->
    items = {}
    {
      set: (list, item) ->
        items[list] = item
      get: (list) ->
        items[list]
      clear: (list) ->
        items[list] = null
    }
  )
.directive('dragToReorder', ['itemBeingDragged', (itemBeingDragged) ->
  link: (scope, element, attrs) ->
    unless scope[attrs.dragToReorder]?
      throw 'Must specify the list to reorder'

    listName = attrs.dragToReorder
    dropAbove = false

    ###
      drag stuff
    ###

    draggingClassName = 'dragging'
    element.attr 'draggable', true

    element.on 'dragstart', (e) ->
      element.addClass draggingClassName
      itemBeingDragged.set(listName, element)

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
        dropAbove = true
      # below
      else
        element.removeClass droppingAboveClassName
        element.addClass droppingBelowClassName
        dropAbove = false

    moveItemInArray = (list, oldIndex, newIndex) ->
      if (newIndex >= list.length)
        k = newIndex - list.length
        while (k--) + 1
          list.push(undefined)
      list.splice(newIndex, 0, list.splice(oldIndex, 1)[0])
      list

    dropHandler = (e) ->
      droppedItem = itemBeingDragged.get(listName)
      if !droppedItem
        return
      oldIndex = droppedItem.scope().$index
      newIndex = if dropAbove then scope.$index - 1 else scope.$index
      theList = scope[attrs.dragToReorder]
      scope.$apply ->
        moveItemInArray(theList, oldIndex, newIndex)
        scope.$emit 'dragToReorder.reordered',
          array: theList
          item: theList[newIndex]
          from: oldIndex
          to: newIndex

      # cleanup
      element.removeClass droppingClassName
      element.removeClass droppingAboveClassName
      element.removeClass droppingBelowClassName
      element.off 'drop', dropHandler
      dropAbove = false
      itemBeingDragged.clear(listName)

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
