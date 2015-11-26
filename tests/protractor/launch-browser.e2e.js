describe('open kanban', function() {
    it('should open filters dropdown', function() {
        browser.get('http://localhost:4000/#/stub');
        browser.waitForAngular();
        expect($('kanban-card').isDisplayed()).toEqual(true);
    });
});