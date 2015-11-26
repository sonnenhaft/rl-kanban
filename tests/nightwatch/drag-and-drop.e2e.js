module.exports = {
    'checking cards drag and drop': function (browser) {
        browser.url('http://localhost:4000').waitForElementVisible('kanban-card', 10000)
            .assert.elementPresent('swim-lane:nth-child(2)  kanban-column:nth-child(1)  kanban-card')
            .moveToElement('kanban-card', 150, 150)
            .mouseButtonDown(0)
            .moveToElement('kanban-column:nth-child(1)', 20, 150)
            .moveToElement('kanban-column:nth-child(3)', 20, 150)
            .moveToElement('kanban-column:nth-child(4)', 20, 150)
            .mouseButtonUp(0)
            .assert.elementNotPresent('swim-lane:nth-child(2)  kanban-column:nth-child(1)  kanban-card')
            .end();
    },
    'card should not be dropped into denied column': function (browser) {
        browser.url('http://localhost:4000').waitForElementVisible('kanban-card', 10000)
            .assert.elementPresent('swim-lane:nth-child(2)  kanban-column:nth-child(1)  kanban-card')
            .moveToElement('kanban-card', 10, 10)
            .mouseButtonDown(0)
            .moveToElement('kanban-column:nth-child(1)', 20, 150)
            .moveToElement('kanban-column:nth-child(3)', 20, 150)
            .moveToElement('kanban-column:nth-child(4)', 20, 150)
            .moveToElement('kanban-column:nth-child(5)', 20, 150)
            .mouseButtonUp(0)
            .assert.elementPresent('swim-lane:nth-child(2)  kanban-column:nth-child(1)  kanban-card')
            .end();
    }
};