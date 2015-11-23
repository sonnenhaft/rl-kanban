module.exports = {
    'checking cards drag and drop': function (browser) {
        browser
            .url('http://localhost:4000')
            .waitForElementVisible('.task-name', 10000)
            .assert.elementPresent('swim-lane:nth-child(2)  .kanban-clmn:nth-child(1) > kanban-card')
            .moveToElement('.task-name', 150, 150)
            .mouseButtonDown(0)
            .moveToElement('.kanban-clmn:nth-child(1)', 20, 250)
            .moveToElement('.kanban-clmn:nth-child(3)', 20, 250)
            .moveToElement('.kanban-clmn:nth-child(4)', 20, 250)
            .mouseButtonUp(0)
            .assert.elementNotPresent('swim-lane:nth-child(2)  .kanban-clmn:nth-child(1) > kanban-card')
            .end();
    },
    //'card should not be dropped into dissalowed column': function (browser) {
    //    browser
    //        .url('http://localhost:4000')
    //        .waitForElementVisible('.task-name', 10000)
    //        .assert.elementPresent('swim-lane:nth-child(2)  .kanban-clmn:nth-child(1) > kanban-card')
    //        .moveToElement('.task-name', 10, 10)
    //        .mouseButtonDown(0)
    //        .moveToElement('.kanban-clmn:nth-child(1)', 20, 250)
    //        .moveToElement('.kanban-clmn:nth-child(3)', 20, 250)
    //        .moveToElement('.kanban-clmn:nth-child(4)', 20, 250)
    //        .moveToElement('.kanban-clmn:nth-child(5)', 20, 250)
    //        .mouseButtonUp(0)
    //        .assert.elementPresent('swim-lane:nth-child(2)  .kanban-clmn:nth-child(1) > kanban-card')
    //        .end();
    //}
};