angular.module('kanban-control').run(function ($rootScope, hostedStub, $http) {
    var url = 'http://beta.json-generator.com/api/json/get/Px6fIEL';
    $http.get(url, {cache: false, isArray: true}).then(function (response) {
        $rootScope.config = response.data;
    }, function () {
        $rootScope.config = hostedStub;
    });
}).value('hostedStub', {
    "id": "554c9acf548f563c4d2e256f",
    "columns": [
        {
            "columns": [
                {
                    "cards": [
                        {
                            "data": "Aliquip aliquip aliqua adipisicing id.",
                            "index": 0,
                            "groupId": "554ceb8b7b34cab494a718fe",
                            "id": "554ceb8b10ff1f5d35377331"
                        },
                        {
                            "data": "Veniam adipisicing nostrud officia eiusmod mollit id commodo Lorem anim do.",
                            "index": 1,
                            "groupId": "554ceb8b2565164f174260fd",
                            "id": "554ceb8b3b8d33653367d012"
                        },
                        {
                            "data": "Magna eiusmod commodo ullamco ad dolor sint consectetur magna commodo culpa.",
                            "index": 2,
                            "groupId": "554ceb8bcfac3ef339842a4b",
                            "id": "554ceb8b44cf479afc523ebe"
                        },
                        {
                            "data": "Laboris eu quis ex enim voluptate esse nisi enim.",
                            "index": 3,
                            "groupId": "554ceb8b20d6e2a13a64f997",
                            "id": "554ceb8ba95dfd9a36d6b85a"
                        }
                    ],
                    "name": "Not started",
                    "id": "554ceb8bdb2111a98a3721a6"
                },
                {
                    "cards": [
                        {
                            "data": "Incididunt sint culpa tempor consequat exercitation esse et occaecat id nostrud.",
                            "index": 0,
                            "groupId": "554ceb8b3b4defbe62be2df7",
                            "id": "554ceb8bc579f16a8378ff2a"
                        },
                        {
                            "data": "Consequat minim enim amet veniam nisi.",
                            "index": 1,
                            "groupId": "554ceb8bc368aafd0705f976",
                            "id": "554ceb8b16ad5c40628cd8f4"
                        },
                        {
                            "data": "Et consequat ex commodo pariatur nulla velit sit enim ullamco ut Lorem.",
                            "index": 2,
                            "groupId": "554ceb8b1af48b02ee2ef5ce",
                            "id": "554ceb8b1a4dbf88dc19fd1a"
                        },
                        {
                            "data": "Ut dolor officia adipisicing amet ut pariatur occaecat magna deserunt dolore.",
                            "index": 3,
                            "groupId": "554ceb8c554f62c4a1717948",
                            "id": "554ceb8c62fa536011721366"
                        }
                    ],
                    "name": "Not started",
                    "id": "554ceb8b132df3dd5b69f8e3"
                },
                {
                    "cards": [
                        {
                            "data": "Aliquip id est voluptate ut sint aliqua deserunt.",
                            "index": 0,
                            "groupId": "554ceb8c5d3d6e184f0d66b4",
                            "id": "554ceb8ccc801c0d6a96a1a8"
                        },
                        {
                            "data": "Minim aliquip pariatur reprehenderit incididunt anim proident minim.",
                            "index": 1,
                            "groupId": "554ceb8cdb8e1ba588752693",
                            "id": "554ceb8c7d030534fbe397b8"
                        }
                    ],
                    "name": "In progress",
                    "id": "554ceb8c7a8ce7dd2ca81cb6"
                },
                {
                    "cards": [
                        {
                            "data": "Dolor reprehenderit ipsum do voluptate qui qui sunt laboris nostrud occaecat nisi.",
                            "index": 0,
                            "groupId": "554ceb8c7611bf40defaa840",
                            "id": "554ceb8cc571d3b61aeaaf11"
                        },
                        {
                            "data": "In sunt enim velit Lorem laboris ad aliqua esse minim.",
                            "index": 1,
                            "groupId": "554ceb8c3ddeec81826eb992",
                            "id": "554ceb8cef1bef1d9b163dd7"
                        },
                        {
                            "data": "Velit commodo duis ut do ea sunt consequat.",
                            "index": 2,
                            "groupId": "554ceb8cb862e1ca06861b0d",
                            "id": "554ceb8c6118177d96c25429"
                        }
                    ],
                    "name": "Completed",
                    "id": "554ceb8c96940412fd558e0f"
                }
            ],
            "index": 0,
            "id": "554ceb8bf39a658a6337aecc"
        }
    ]
});
