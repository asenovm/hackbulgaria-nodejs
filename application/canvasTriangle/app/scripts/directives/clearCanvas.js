angular.module('canvasTriangleApp')
  .directive('clearCanvas', function() {
    return {
        link: function (scope, element, attrs) {
            var $canvas = $('.canvas-triangle'),
                context = $canvas[0].getContext('2d');

            $(element).on('click touchstart', function (event) {
                context.clearRect(0, 0, $canvas.width(), $canvas.height());
                scope.points = [];
            });
        }
    };
  });
