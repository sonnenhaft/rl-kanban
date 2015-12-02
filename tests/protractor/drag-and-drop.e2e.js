describe('drag-and-drop', function () {
    function moveToColumn(columnSelector) {
        return function () {
            return browser.actions()
                .mouseMove((columnSelector))
                .perform()
                .then(function () {return browser.sleep(0.5);})
        }
    }

    function expectFirstCardPresent() {
        var firstCard = $$('swim-lane').first().$$('kanban-column').first().$('kanban-card');
        return expect(firstCard.isPresent())
    }

    function getTestCard() {
        return element(by.cssContainingText('kanban-card', 'qui nulla et incididunt consectetur'));
    }

    var columns, movePromise;
    beforeEach(function () {
        browser.get('http://localhost:4000/#/stub');
        expectFirstCardPresent().toBe(true);
        columns = $$('swim-lane').first().$$('kanban-column');
        movePromise = browser.actions().mouseDown(getTestCard()).perform()
            .then(moveToColumn(columns.first()))
            .then(moveToColumn(columns.get(2)))
            .then(moveToColumn(columns.get(3)));
    });

    it('checking cards drag and drop', function () {
        movePromise.then(function () {
            return browser.actions().mouseUp().perform();
        });
        expectFirstCardPresent().toBe(false);
    });

    it('card should not be dropped into denied column', function () {
        movePromise.then(moveToColumn(columns.get(4))).then(function () {
            return browser.actions().mouseUp().perform();
        });
        expectFirstCardPresent().toBe(true);
    });

    afterEach(function () {
        expect(getTestCard().isPresent()).toBe(true);
    });

});