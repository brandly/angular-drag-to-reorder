/*
  angular-drag-to-reorder v0.0.2
  http://brandly.github.io/angular-drag-to-reorder/
*/
(function() {
  angular.module('mb-dragToReorder', []).directive('dragToReorder', [
    function() {
      return {
        scope: {
          dragToReorder: '='
        },
        link: function(scope, element, attrs) {

          /*
            drag stuff
           */
          var dragOverHandler, draggingClassName, dropHandler, droppingAboveClassName, droppingBelowClassName, droppingClassName;
          draggingClassName = 'dragging';
          element.attr('draggable', true);
          element.on('dragstart', function(e) {
            element.addClass(draggingClassName);
            return e.dataTransfer.setData('text/plain', scope.$parent.$index);
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
            var hoveredElementY, offsetY;
            e.preventDefault();
            offsetY = e.offsetY || e.layerY;
            hoveredElementY = this.offsetTop - this.scrollTop + this.clientTop;
            if (offsetY < hoveredElementY + (this.offsetHeight / 2)) {
              element.removeClass(droppingBelowClassName);
              return element.addClass(droppingAboveClassName);
            } else {
              element.removeClass(droppingAboveClassName);
              return element.addClass(droppingBelowClassName);
            }
          };
          dropHandler = function(e) {
            var droppedItemIndex, itemToMove, newIndex;
            e.preventDefault();
            droppedItemIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
            newIndex = null;
            if (element.hasClass(droppingAboveClassName)) {
              if (droppedItemIndex < scope.$parent.$index) {
                newIndex = scope.$parent.$index - 1;
              } else {
                newIndex = scope.$parent.$index;
              }
            } else {
              if (droppedItemIndex < scope.$parent.$index) {
                newIndex = scope.$parent.$index;
              } else {
                newIndex = scope.$parent.$index + 1;
              }
            }
            itemToMove = scope.dragToReorder[droppedItemIndex];
            scope.dragToReorder.splice(droppedItemIndex, 1);
            scope.dragToReorder.splice(newIndex, 0, itemToMove);
            scope.$apply(function() {
              return scope.$emit('dragToReorder.reordered', {
                array: scope.dragToReorder,
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
