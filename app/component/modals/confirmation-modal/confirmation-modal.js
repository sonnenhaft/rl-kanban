angular.module('component.modals.confirmation-modal', [
    'mm.foundation.modal',
    'template/modal/backdrop.html',
    'template/modal/window.html'
]).factory('confirmationModal', function ($modal) {
    return {
        open: function () {
            return $modal.open({
                windowClass: 'tiny confirmation-modal',
                templateUrl: 'app/component/modals/confirmation-modal/confirmation-modal.html',
            });
        }
    };
});