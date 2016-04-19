describe('component.is-touch', function () {
    var provider;
    describe('with emulated window', function () {
        beforeEach(module('component.is-touch', function (isTouchProvider, $provide) {
            provider = isTouchProvider;
            $provide.value('$window', {
                navigator: {
                    userAgent: 'iPad'
                }
            });
        }));

        it('tests the providers internal function', inject(function ($window) {
            expect(provider.$get($window)).toBe(true);
        }));
    });

    describe('without  emulated window', function () {
        beforeEach(module('component.is-touch', function (isTouchProvider, $provide) {
            provider = isTouchProvider;
            $provide.value('$window', {
                navigator: {
                    userAgent: 'IEMobile'
                }
            });
        }));

        it('tests the providers internal function', inject(function ($window) {
            expect(provider.$get($window)).toBe(true);
        }));
    });

    describe('not touch', function () {
        beforeEach(module('component.is-touch', function ($provide, isTouchProvider) {
            provider = isTouchProvider;
            $provide.value('$window', {
                navigator: {
                    userAgent: 'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; ' +
                    'NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729; InfoPath.3; Zune 4.7; rv:11.0) like Gecko'
                }
            });
        }));

        it('isTouch shoul be false for desktop IE', inject(function ($window) {
            expect(provider.$get($window)).toBe(false);
        }));

        it('isNotTouch shoul be true for desktop IE', inject(function (isNotTouch) {
            expect(isNotTouch).toBe(true);
        }));
    });
});
