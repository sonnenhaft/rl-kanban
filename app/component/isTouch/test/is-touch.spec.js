describe('component.is-touch', function () {
    var provider;
    describe('with emulated window', function () {
        beforeEach(module('component.is-touch', function (isTouchProvider, $provide) {
            provider = isTouchProvider;
            $provide.value('$window', {
                document: angular.noop,
                DocumentTouch: jasmine.createSpy('DocumentTouch')
            });
        }));

        it('tests the providers internal function', inject(function ($window) {
            expect(provider.$get($window)).toBe(false);
        }));
    });

    describe('without  emulated window', function () {
        beforeEach(module('component.is-touch', function (isTouchProvider) {
            provider = isTouchProvider;
        }));

        it('tests the providers internal function', inject(function ($window) {
            expect(provider.$get($window)).toBe(true);
        }));
    });

    describe('not touch', function () {
        beforeEach(module('component.is-touch', function ($provide) {
            $provide.value('isTouch', false);
        }));

        it('tests the providers internal function', inject(function (isNotTouch) {
            expect(isNotTouch).toBe(true)
        }));
    });
});
