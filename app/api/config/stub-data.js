angular.module('kanban-control').run(function ($rootScope, hostedStub) {
    $rootScope.config = hostedStub;
/*
}).run(function ($rootScope, hostedStub, $http) {
    var url = 'http://beta.json-generator.com/api/json/get/I7u7YcZ';
    $http.get(url, {cache: false}).then(function (data) {
        $rootScope.config = data.data;
    }, function () {
        $rootScope.config = hostedStub;
    });
*/
}).value('hostedStub', {
    "id": "554c9acf548f563c4d2e256f",
    "columns": [
        {
            "id": "554c9acff8f528b4e06e5f65",
            "name": "Fri 8/5",
            "cards": [
                {
                    "id": "554c9acf7f80fc1a8fad07c6",
                    "groupId": "554c9acf19f9d89b1587b4f4",
                    "index": 0,
                    "data": "Adipisicing pariatur laborum incididunt laborum consectetur laboris consequat."
                },
                {
                    "id": "554c9acfd20e7084f23c8194",
                    "groupId": "554c9acf2f7b00de86792acd",
                    "index": 1,
                    "data": "Voluptate consectetur deserunt nulla qui qui nulla laboris."
                },
                {
                    "id": "554c9acf82aa1349526d55a3",
                    "groupId": "554c9acf2bfd54f0be2ead94",
                    "index": 2,
                    "data": "Officia nisi labore elit eiusmod."
                }
            ]
        },
        {
            "id": "554c9acf1927073ef05d21cc",
            "name": "Sat 9/5",
            "cards": [
                {
                    "id": "554c9acf4d5d2c0fb2d9ca3d",
                    "groupId": "554c9acfbe5009a9aa34281f",
                    "index": 0,
                    "data": "Veniam tempor id laborum tempor voluptate deserunt in et pariatur deserunt est Lorem quis."
                },
                {
                    "id": "554c9acfd6383966d26a4bdf",
                    "groupId": "554c9acf18352ab78943f74a",
                    "index": 1,
                    "data": "Do eu officia cupidatat ea consectetur nostrud veniam exercitation qui."
                },
                {
                    "id": "554c9acff029293fe8351f70",
                    "groupId": "554c9acf47c0e929c2c3b17d",
                    "index": 2,
                    "data": "Sit et sint nulla exercitation magna adipisicing culpa consectetur reprehenderit duis mollit."
                }
            ]
        },
        {
            "id": "554c9acf3fba5777917499cb",
            "name": "Sun 10/5",
            "cards": [
                {
                    "id": "554c9acfb3730a42bd50e1d8",
                    "groupId": "554c9acf29c44db6c2bade4c",
                    "index": 0,
                    "data": "Culpa amet ad cupidatat dolore et sunt elit nostrud excepteur officia."
                },
                {
                    "id": "554c9acf93410ada15d2924c",
                    "groupId": "554c9acfd3998ced78ac5537",
                    "index": 1,
                    "data": "Irure consequat sunt proident id cillum cillum."
                },
                {
                    "id": "554c9acfe6e780e7f3ce48aa",
                    "groupId": "554c9acffd326b9ef0f8263a",
                    "index": 2,
                    "data": "Nisi aute voluptate elit proident id in reprehenderit amet commodo ipsum cillum nostrud."
                },
                {
                    "id": "554c9acfe69ac849217b5e07",
                    "groupId": "554c9acf21ac861fe562edec",
                    "index": 3,
                    "data": "Ut magna minim non aliqua velit veniam Lorem sit do."
                }
            ]
        },
        {
            "id": "554c9acfdc831b0b4890da63",
            "name": "Mon 11/5",
            "cards": [
                {
                    "id": "554c9acf77f960a6fe2bc25c",
                    "groupId": "554c9acffb84b6cefadb7a1b",
                    "index": 0,
                    "data": "Anim commodo ea fugiat sit dolor."
                },
                {
                    "id": "554c9acf524336f6caac27e1",
                    "groupId": "554c9acfbc607b6425a1f854",
                    "index": 1,
                    "data": "Officia do tempor dolore voluptate fugiat veniam do eu."
                }
            ]
        }
    ]
})