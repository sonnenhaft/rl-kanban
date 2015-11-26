describe('check d&d', function () {
    function moveToColumn(columnSelector) {
        return function () {
            return browser.actions()
                .mouseMove((columnSelector))
                .perform()
                .then(function () {return browser.sleep(10);})
        }
    }

    function expectFirstCardPresent() {
        var firstCard = $$('swim-lane').first().$$('kanban-column').first().$('kanban-card');
        return expect(firstCard.isPresent())
    }

    it('checking cards drag and drop', function () {
        browser.get('http://localhost:4000/#/stub');

        expectFirstCardPresent().toBe(true);

        var columns = $$('swim-lane').first().$$('kanban-column');
        browser.actions().mouseDown($('kanban-card')).perform()
            .then(moveToColumn(columns.first()))
            .then(moveToColumn(columns.get(2)))
            .then(moveToColumn(columns.get(3)))
            .then(function () {
                return browser.actions().mouseUp().perform();
            });
        expectFirstCardPresent().toBe(false);
    });

    it('card should not be dropped into denied column', function () {
        browser.get('http://localhost:4000/#/stub');
        expectFirstCardPresent().toBe(true);
        var columns = $$('swim-lane').first().$$('kanban-column');
        browser.actions().mouseDown($('kanban-card')).perform()
            .then(moveToColumn(columns.first()))
            .then(moveToColumn(columns.get(2)))
            .then(moveToColumn(columns.get(3)))
            .then(moveToColumn(columns.get(4)))
            .then(function () {
                return browser.actions().mouseUp().perform();
            });
        expectFirstCardPresent().toBe(true);
    });
});