angular.module('canvasTriangleApp')
  .directive('drawTriangles', function() {
    return {
        link: function (scope, element, attrs) {
            var context = $('.canvas-triangle')[0].getContext('2d'),
                $element = $(element),
                offset = $element.offset();

            scope.points = [];

            $element.on('click touchstart', function (event) {
                var point = {
                    x: event.pageX- offset.left,
                    y: event.pageY - offset.top
                };

                scope.points.push(point);

                context.fillStyle = $('.color-chooser').val();
                context.fillRect(point.x, point.y, 5, 5);

                //XXX this might actually not be a triangle (for example if all the points are on a single line)
                if(scope.points.length === 3) {
                    context.beginPath();
                    context.moveTo(scope.points[0].x, scope.points[0].y);
                    context.lineTo(scope.points[1].x, scope.points[1].y);
                    context.lineTo(scope.points[2].x, scope.points[2].y);
                    context.fill();
                    context.closePath();
                    scope.points = [];
                }
            });
        }
    };
  });
