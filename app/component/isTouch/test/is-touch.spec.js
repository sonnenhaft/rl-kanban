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