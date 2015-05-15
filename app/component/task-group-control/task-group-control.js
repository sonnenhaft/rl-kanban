angular.module('component.task-group-control', [
]).directive('taskGroupControl', function () {
    return {
        templateUrl: 'app/component/task-group-control/task-group-control.html',
        controller: function ($scope, $element) {
            this.element = $element;
            $scope.groups = [
                {name: 'group 1', start: 0, width: 2},
                {name: 'group 2', start: 1, width: 5},
                {name: 'group 3', start: 2, width: 2},
                {name: 'group 4', start: 0, width: 7}
            ];
        }
    };
}).directive('taskGroup', function(){
    return {
        scope: {
            width: '=',
            start: '=',
            name: '='
        },
        require: '^taskGroupControl',
        link: function($scope, $element, $attrs, taskGroupControl){
            var minWidth = 150;
            $element.css({
                width: $scope.width * minWidth + 'px',
                'margin-left':  $scope.start * minWidth + 'px'
            });

            var mouseDownEvent;
            var initialMargin;
            function setMaring(margin){
                if (margin % 150 > 120 || margin % 150 < 30) {
                    $element .css('marginLeft', ( Math.round(margin/ 150))*150 + 'px');
                } else {
                    $element .css('marginLeft',  margin + 'px');
                }
            }
            var lastMargin;
            function mouseMove(event){
                var deltaX =  event.pageX - mouseDownEvent.pageX;
                    //var deltaY =  event.screenY - mouseDownEvent.screenY;
                    //mouseDownEvent = event;

                    //var top =$element .css('marginTop').replace('px', '') - 0;
                lastMargin = (initialMargin + deltaX);
                if (lastMargin % 150 > 120 || lastMargin % 150 < 30) {
                    $element.css('marginLeft', ( Math.round(lastMargin / 150)) * 150 + 'px');
                } else {
                    $element.css('marginLeft', lastMargin + 'px');
                }
                //$element .css('marginTop', (top + deltaY) + 'px');

            }

            var el = angular.element(document.body)//taskGroupControl.element;
            $element.bind('mousedown', function(e){
                mouseDownEvent = e;
                initialMargin = $element .css('marginLeft').replace('px', '') - 0;
                el.bind('mousemove', mouseMove);
                e.preventDefault();
            });

            el.bind('mouseup', function mouseUp(){
                $element .css('marginLeft', ( Math.round(lastMargin/ 150))*150 + 'px');
                el.unbind('mousemove', mouseMove);
                //$element.unbind('mouseup', mouseUp);
            });
        },
        template: '{{name}}'
    }
});