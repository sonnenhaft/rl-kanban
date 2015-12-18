angular.module('component.modals.confirmation-modal', [
    //TODO: Stan, move dependencies and $scope.$on('destroy') into a commod dir;
    'mm.foundation.modal',
    'template/modal/backdrop.html',
    'template/modal/window.html'
]).factory('openConfirmationModal', function ($modal) {
    return {
        open: function ($scope) {
            var modal = $modal.open({
                windowClass: 'tiny confirmation-modal',
                templateUrl: 'app/component/modals/confirmation-modal/confirmation-modal.html',
            });

            if (!$scope) {
                $scope.$on('$destroy', function () {
                    if (modal) { modal.dismiss('cancel'); }
                });
            }

            return modal.result.finally(function () {
                modal = null;
            });
        }
    };
});