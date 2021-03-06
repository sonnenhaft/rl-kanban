angular.module('demo-code.layout-switcher').directive('layoutSwitcher', function ($location, $rootScope, $window) {
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
});