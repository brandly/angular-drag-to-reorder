/*
  angular-drag-to-reorder v0.0.2
  http://brandly.github.io/angular-drag-to-reorder/
*/
(function() {
  angular.module('mb-dragToReorder', []).directive('dragToReorder', [
    function() {
      return {
        link: function(scope, element, attrs) {
          var dragOverHandler, draggingClassName, dropHandler, droppingAboveClassName, droppingBelowClassName, droppingClassName;
          if (scope[attrs.dragToReorder] == null) {
            throw 'Must specify the list to reorder';
          }

          /*
            drag stuff
           */
          draggingClassName = 'dragging';
          element.attr('draggable', true);
          element.on('dragstart', function(e) {
            element.addClass(draggingClassName);
            return e.dataTransfer.setData('text/plain', scope.$index);
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
              return element.addClass(droppingAboveClassName);
            } else {
              element.removeClass(droppingAboveClassName);
              return element.addClass(droppingBelowClassName);
            }
          };
          dropHandler = function(e) {
            var droppedItemIndex, i, itemToMove, newIndex, theList, _i, _j;
            e.preventDefault();
            droppedItemIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
            theList = scope[attrs.dragToReorder];
            newIndex = null;
            if (element.hasClass(droppingAboveClassName)) {
              if (droppedItemIndex < scope.$index) {
                newIndex = scope.$index - 1;
              } else {
                newIndex = scope.$index;
              }
            } else {
              if (droppedItemIndex < scope.$index) {
                newIndex = scope.$index;
              } else {
                newIndex = scope.$index + 1;
              }
            }
            itemToMove = theList[droppedItemIndex];
            if (newIndex > droppedItemIndex) {
              for (i = _i = droppedItemIndex; _i < newIndex; i = _i += 1) {
                theList[i] = theList[i + 1];
              }
            } else if (newIndex < droppedItemIndex) {
              for (i = _j = droppedItemIndex; _j > newIndex; i = _j += -1) {
                theList[i] = theList[i - 1];
              }
            }
            theList[newIndex] = itemToMove;
            scope.$apply(function() {
              return scope.$emit('dragToReorder.reordered', {
                array: theList,
                item: itemToMove,
                from: droppedItemIndex,
                to: newIndex
              });
            });
            element.removeClass(droppingClassName);
            element.removeClass(droppingAboveClassName);
            element.removeClass(droppingBelowClassName);
            return element.off('drop', dropHandler);
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
