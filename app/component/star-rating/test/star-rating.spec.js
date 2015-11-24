describe.module('component.star-rating', function () {
    var directive;

    it('should be defined', inject(function (directiveBuilder) {
        directive = directiveBuilder.$build('<star-rating value="3"></star-rating>');
        expect(directive.element).toBeDefined();
        expect(directive.element.isolateScope().stars.filter(function(star){
            return star.filled;
        }).length).toBe(3);
    }));

    it('should has max rating', inject(function (directiveBuilder) {
        directive = directiveBuilder.$build('<star-rating value="1" max="4"></star-rating>');
        expect(directive.element).toBeDefined();
        expect(directive.element.isolateScope().stars.length).toBe(4);
        expect(directive.element.isolateScope().stars.filter(function(star){
            return star.filled;
        }).length).toBe(1);
    }));
});
