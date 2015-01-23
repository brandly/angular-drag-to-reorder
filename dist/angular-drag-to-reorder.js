/*
  angular-drag-to-reorder v0.0.2
  http://brandly.github.io/angular-drag-to-reorder/
*/
(function() {
  angular.module('mb-dragToReorder', []).factory('itemBeingDragged', function() {
    var items;
    items = {};
    return {
      set: function(list, item) {
        return items[list] = item;
      },
      get: function(list) {
        return items[list];
      },
      clear: function(list) {
        return items[list] = null;
      }
    };
  }).directive('dragToReorder', [
    'itemBeingDragged', function(itemBeingDragged) {
      return {
        link: function(scope, element, attrs) {
          var dragOverHandler, draggingClassName, dropAbove, dropHandler, droppingAboveClassName, droppingBelowClassName, droppingClassName, listName, moveItemInArray;
          if (scope[attrs.dragToReorder] == null) {
            throw 'Must specify the list to reorder';
          }
          listName = attrs.dragToReorder;
          dropAbove = false;

          /*
            drag stuff
           */
          draggingClassName = 'dragging';
          element.attr('draggable', true);
          element.on('dragstart', function(e) {
            element.addClass(draggingClassName);
            return itemBeingDragged.set(listName, element);
          });
          element.on('dragend', function() {
            return element.removeClass(draggingClassName);
          });

          /*
            drop stuff
           */
          droppingClassName = 'dropping';
          droppingAboveClassName = 'dropping-above';
          droppingBelowClassName = 'dropping-below';
          dragOverHandler = function(e) {
            var offsetY;
            e.preventDefault();
            offsetY = e.offsetY || e.layerY;
            if (offsetY < (this.offsetHeight / 2)) {
              element.removeClass(droppingBelowClassName);
              element.addClass(droppingAboveClassName);
              return dropAbove = true;
            } else {
              element.removeClass(droppingAboveClassName);
              element.addClass(droppingBelowClassName);
              return dropAbove = false;
            }
          };
          moveItemInArray = function(list, oldIndex, newIndex) {
            var k;
            if (newIndex >= list.length) {
              k = newIndex - list.length;
              while ((k--) + 1) {
                list.push(void 0);
              }
            }
            list.splice(newIndex, 0, list.splice(oldIndex, 1)[0]);
            return list;
          };
          dropHandler = function(e) {
            var droppedItem, newIndex, oldIndex, theList;
            droppedItem = itemBeingDragged.get(listName);
            if (!droppedItem) {
              return;
            }
            oldIndex = droppedItem.scope().$index;
            newIndex = dropAbove ? scope.$index - 1 : scope.$index;
            theList = scope[attrs.dragToReorder];
            scope.$apply(function() {
              moveItemInArray(theList, oldIndex, newIndex);
              return scope.$emit('dragToReorder.reordered', {
                array: theList,
                item: theList[newIndex],
                from: oldIndex,
                to: newIndex
              });
            });
            element.removeClass(droppingClassName);
            element.removeClass(droppingAboveClassName);
            element.removeClass(droppingBelowClassName);
            element.off('drop', dropHandler);
            dropAbove = false;
            return itemBeingDragged.clear(listName);
          };
          element.on('dragenter', function(e) {
            if (element.hasClass(draggingClassName)) {
              return;
            }
            element.addClass(droppingClassName);
            element.on('dragover', dragOverHandler);
            return element.on('drop', dropHandler);
          });
          return element.on('dragleave', function(e) {
            element.removeClass(droppingClassName);
            element.removeClass(droppingAboveClassName);
            element.removeClass(droppingBelowClassName);
            element.off('dragover', dragOverHandler);
            return element.off('drop', dropHandler);
          });
        }
      };
    }
  ]);

}).call(this);
