describe('isTouch provider', function () {
    describe('isTouch', function () {
        var provider;

        beforeEach(module('component.is-touch', function(isTouchProvider) {
            provider = isTouchProvider;
        }));

        it('tests the providers internal function', inject(function($window) {
            expect(provider.$get($window)).toBe(true);
        }));
    });

    describe('isTouch', function() {
        var provider;

        beforeEach(module('component.is-touch', function(isTouchProvider) {
            provider = isTouchProvider;
        }));

        beforeEach(module(function($provide) {
            $provide.value('$window', {
                document: angular.noop,
                DocumentTouch: jasmine.createSpy('DocumentTouch')
            });
        }));

        it('tests the providers internal function', inject(function($window) {
            expect(provider.$get($window)).toBe(false);
        }));
    });
});

describe('isNotTouch', function () {
    beforeEach(module('component.is-touch'));

    it('tests the providers internal function', function() {
        var isNotTouch;

        beforeEach(module(function($provide){
            $provide.value('isTouch', false);
        }));

        beforeEach(inject(function(_isNotTouch_){
            isNotTouch = _isNotTouch_;
        }));
        expect(isNotTouch).toBe(true)
    });

    it('tests the providers internal function', function() {
        var isNotTouch;

        beforeEach(module(function($provide){
            $provide.value('isTouch', true);
        }));

        beforeEach(inject(function(_isNotTouch_){
            isNotTouch = _isNotTouch_;
        }));
        expect(isNotTouch).toBe(false)
    });
});