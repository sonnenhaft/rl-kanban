describe('component.is-touch-1', function () {
    var provider;

    beforeEach(module('component.is-touch', function(isTouchProvider) {
        provider = isTouchProvider;
    }));

    it('tests the providers internal function', inject(function($window) {
        expect(provider.$get($window)).toBe(true);
    }));
});

describe('component.is-touch-false', function() {
    var provider;

    beforeEach(module('component.is-touch-2', function(isTouchProvider) {
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

describe('isNotTouch', function () {
    var isNotTouch;
    beforeEach(module('component.is-touch'));
    beforeEach(module(function($provide){
        $provide.value('isTouch', false);
    }));

    beforeEach(inject(function(_isNotTouch_){
        isNotTouch = _isNotTouch_;
    }));

    it('tests the providers internal function', function() {
        expect(isNotTouch).toBe(true)
    });
});