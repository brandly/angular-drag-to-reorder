# Angular Drag to Reorder

> Drag items in an ng-repeat to reorder them

```shell
$ bower install --save angular-drag-to-reorder
```

I wrote this for [another small project](http://brandly.github.io/thelist/#/), and I figured someone else might find it useful. It's probably far less stable than something like [UI Sortable](https://github.com/angular-ui/ui-sortable), but that has all kinds of dependencies. This just needs Angular.

There aren't many frills, but it seems to do the job in up-to-date browsers.

## But how?

Add `drag-to-reorder` alongside your `ng-repeat` and specify the name of the collection.

```html
<ul>
  <li ng-repeat="item in list" drag-to-reorder="list"></li>
</ul>
```

And it should Just Work&#0153;.

You may specify a drag handle:

```html
<ul>
  <li ng-repeat="item in list" drag-to-reorder="list" drag-handle="my-handle">
    <div class="my-handle">Drag me</div>
  </li>
</ul>
```

## What else?

### Classes

When dragging and dropping elements, some classes will be added to those elements, so you can style accordingly.

The element being dragged will have a `dragging` class on it.

The element that is being hovered over by a dragged element will have a `dropping` class. More specifically, you'll see a `dropping-above` or `dropping-below` class on there, depending on where the dragged element will end up after being dropped.

### Events

##### Dragstart 
When an item gets dragged, `dragToReorder.dragstart` will fire, passing you the dragged item and it's index.
```js
$scope.$on('dragToReorder.dragstart', function ($event, dragstart) {
  // The item that was relocated
  dragstart.item

  // The initial index of that item
  dragstart.from
});
```	

##### Reordered 
When the list gets reordered, `dragToReorder.reordered` will fire, passing you some relevant data.
```js
$scope.$on('dragToReorder.reordered', function ($event, reordered) {
  // The item that was relocated
  reordered.item

  // The initial index of that item
  reordered.from

  // The index where it ended up
  reordered.to
});
```

##### Dragend 
This event will always fire when the dragged item is dropped, even is the order hasn't changed.
```js
$scope.$on('dragToReorder.dragend', function ($event) {
  // Your code here
});
```

### Demo

[Look!](http://brandly.github.io/angular-drag-to-reorder/)

### Development

Get your dependencies
```shell
$ npm install
```

And use `gulp` to build, watch, and host the project.
```shell
$ gulp
```
