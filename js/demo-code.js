//TODO (vlad or stan): extract this verion of package-verison directive into gulp-files
angular.module('package-version', []).directive('packageVersion', ["$http", "$injector", "$q", function ( $http, $injector, $q ) {
    function getPackageJsonVersion() {
        return $http.get('package.json').then(function ( response ) { return response.data.version; });
    }

    return {
        restrict: 'A',
        scope: { key: '@packageVersion' },
        transclude: true,
        template: '' +
        '<div class="text-right grey-text">' +
            '<span class="name" ng-transclude></span>' +
            '&nbsp;&nbsp;<b>v{{version}}</b>' +
        '</div>',
        link: function ( $scope ) {
            $q.when($injector.get($scope.key) || getPackageJsonVersion()).then(function ( version ) {
                $scope.version = version;
            });
        }
    };
}]);

angular.module('kanban-demo', [
    'package-version' ,
    'demo-code.events-debugger',
    'demo-code.layout-switcher',
    'demo-code.groups-debug',
    'kanban'
]);
angular.module('demo-code.groups-debug', []);
angular.module('demo-code.layout-switcher', [
    'mm.foundation.modal',
    'template/modal/backdrop.html',
    'template/modal/window.html'
]);
angular.module('demo-code.events-debugger', [
    'component.is-touch',
    'cgNotify'
]).directive('eventsDebugger', ["eventsToDebug", "notify", "$log", "isTouch", function (eventsToDebug, notify, $log, isTouch) {
    return function ($scope) {
        if (isTouch) {
            return;
        }
        eventsToDebug.forEach(function (eventName) {
            $scope.$on(eventName, function () {
                var args = Array.prototype.slice.call(arguments, 1);
                var message = eventName + ' ' + args.join(' ');
                $log.info(message);
                notify({message: message, duration: 5000, position: 'right'});
            });
        });
    };
}]).value('eventsToDebug', [
    'kanban:task:start',
    'kanban:task:stop',
    'kanban:task:moved',
    'kanban:task:orderchanged',
    'kanban:task:remove',
    'kanban:task:modalopen',
    'kanban:add-group',
    'kanban:add-task',
    'kanban:add-task-assessment',
    'kanban:column:hide',
    'kanban:column:show'
]);
angular.module('demo-code.groups-debug').directive('groupsDebug', function () {
    return {
        templateUrl: 'app/demo-code/groups-debug/groups-debug.html',
        scope: {groups: '='}
    };
});
angular.module('demo-code.groups-debug').directive('opacityOnChanged', ["$timeout", function ($timeout) {
    return function ($scope, $element, $attr) {
        $scope.$watch($attr.opacityOnChanged, function (value) {
            if (!value) {
                return;
            }

            $element.addClass('opacity-on-changed');
            $timeout(function () { $element.removeClass('opacity-on-changed');}, 1000, false);

            if ($attr.setText) {
                $timeout(function () { $element.text(value); }, 500, false);
            } else {
                $scope.$eval($attr.evalAfter);
            }
        });
    };
}]);
angular.module('demo-code.layout-switcher').controller('LayoutSwitcherDemoController', ["$location", "$scope", "mockGetter", "$modal", "$q", function ($location, $scope, mockGetter, $modal, $q) {
    $scope.locationSearch = $location.search();

    $scope.$watchCollection('locationSearch', function (locationSearch) {
        $q.all({
            layout: mockGetter.getLayout(locationSearch.layout || 'work-tracker'),
            contentLevel: mockGetter.getContentLevel(/work-tracker/i.test(locationSearch.layout) ? 'work-tracker' : 'planner')
        }).then(function (result) {

            $scope.config = angular.copy(result.layout);

            if (locationSearch.contentLevel) {
                $scope.config.settings.tasksDisplayFields = result.contentLevel[locationSearch.contentLevel];
            }

            if (locationSearch.empty) {
                $scope.config.groups = [];
                $scope.config.tasks = [];
            }

            if ($scope.config.settings) {
                $scope.config.settings.readOnly = locationSearch.readOnly;
            }
        });
    });

    $scope.$on('kanban:task:moved', function ($event, taskId) {
        var columnId = '555b6911ba6d349f6253cd85';
        $scope.kanbanModel.tasks.forEach(function (task) {
            if (task.id === taskId && task.validStates) {
                task.validStates.push(columnId);
            }
        });
    });

    $scope.$on('kanban:task:modalopen', function () {
        $modal.open({
            windowClass: 'tiny task-card-modal-demo',
            templateUrl: 'app/demo-code/layout-switcher/demo-modal.html'
        });
    });
}]);
angular.module('demo-code.layout-switcher').directive('layoutSwitcher', ["$location", "$rootScope", "$window", function ($location, $rootScope, $window) {
    return {
        templateUrl: 'app/demo-code/layout-switcher/layout-switcher.html',
        scope: true,
        link: function ($scope) {
            $scope.hash = $location.search();
            $scope.hash.layout = $scope.hash.layout || 'work-tracker';
            $scope.hash.contentLevel = $scope.hash.contentLevel || 'maximum';
            ['layout', 'contentLevel', 'readOnly', 'empty'].forEach(function (key) {
                $scope.$watch('hash.' + key, function (value) {
                    $location.search(key, value || null);
                });
            });

            $scope.isOpened = $window.localStorage.isOpened === 'true';
            $scope.$watch('isOpened', function(){
                $window.localStorage.isOpened = $scope.isOpened;
            });

            $scope.updateCard = function(){
                $rootScope.$broadcast('update:kanban:card', {
                    id: '8F6328',
                    primarySlot: Math.random() + '',
                    notes: Math.random() + ''
                });
            };
        }
    };
}]);
angular.module('demo-code.layout-switcher').factory('mockGetter', ["$http", function ($http) {
    function getJson(parentFolderName, fileName) {
        return $http.get(parentFolderName + fileName + '.json').then(function (data) {return data.data;});
    }

    return {
        getLayout: function (contentLevelName) {
            return getJson('app/demo-code/layout-switcher/layouts/', contentLevelName);
        },
        getContentLevel: function (contentLevelName) {
            return getJson('app/demo-code/layout-switcher/content-levels/', contentLevelName);
        }
    };
}]);
