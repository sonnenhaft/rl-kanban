angular.module('kanban').run(function ($rootScope, hostedStub, $http) {
    var url = 'http://beta.json-generator.com/api/json/get/Px6fIEL';
    $http.get(url, {cache: false}).then(function (response) {
        $rootScope.config = response.data;
    }, function () {
        $rootScope.config = hostedStub;
    });
}).value('hostedStub', {
    "columns": [
        {
            "cards": [
                {
                    "data": "Sunt Lorem fugiat velit ullamco magna laboris ea sint velit proident nulla anim nisi in.",
                    "name": "Casey",
                    "code": "F0408B",
                    "color": "green",
                    "groupId": "554fd0f03360a5e381d247b3",
                    "id": "554fd0f056db6ced35975f67"
                },
                {
                    "data": "Consequat laboris officia eiusmod reprehenderit velit ipsum amet ut veniam et culpa reprehenderit.",
                    "name": "Vincent",
                    "code": "F0D941",
                    "color": "blue",
                    "groupId": "554fd0f0151bff82552ae1eb",
                    "id": "554fd0f02bea986efac4e556"
                },
                {
                    "data": "Ut amet ipsum laborum voluptate ea sit.",
                    "name": "Cherry",
                    "code": "F07F10",
                    "color": "blue",
                    "groupId": "554fd0f00a342272c07d4b20",
                    "id": "554fd0f01645788960ef87a7"
                },
                {
                    "data": "Aliquip occaecat est eiusmod aliqua consequat deserunt nisi in.",
                    "name": "Ramona",
                    "code": "F059EE",
                    "color": "orange",
                    "groupId": "554fd0f0d006e6db514b7725",
                    "id": "554fd0f08ecdbad5687cb4c6"
                }
            ],
            "name": "List 1 Name",
            "id": "554fd0f0b6657fc1f48fae59"
        },
        {
            "cards": [
                {
                    "data": "Do eu exercitation excepteur sunt duis.",
                    "name": "Patterson",
                    "code": "F04A55",
                    "color": "orange",
                    "groupId": "554fd0f04842b38d6d93d73a",
                    "id": "554fd0f07de1740340a5715f"
                },
                {
                    "data": "Ullamco consequat est pariatur commodo tempor non.",
                    "name": "Burt",
                    "code": "F06773",
                    "color": "orange",
                    "groupId": "554fd0f0244922ca633a1767",
                    "id": "554fd0f0bcba25f406581c75"
                },
                {
                    "data": "Irure excepteur aute nisi eiusmod qui pariatur deserunt ipsum magna laborum.",
                    "name": "Margie",
                    "code": "F021FC",
                    "color": "green",
                    "groupId": "554fd0f0fccb45e214fb7614",
                    "id": "554fd0f05937c9cb15a033f3"
                }
            ],
            "name": "List 2 Name",
            "id": "554fd0f0fcda521e73e6063b"
        },
        {
            "cards": [
                {
                    "data": "Lorem sit labore sint dolor magna excepteur duis mollit.",
                    "name": "Felicia",
                    "code": "F00045",
                    "color": "blue",
                    "groupId": "554fd0f0854aab10cc363112",
                    "id": "554fd0f0e9849d414ee5d725"
                },
                {
                    "data": "Pariatur culpa aute ex consectetur tempor minim commodo ullamco dolore ea.",
                    "name": "Florence",
                    "code": "F030FC",
                    "color": "green",
                    "groupId": "554fd0f0739c9e943dc0a437",
                    "id": "554fd0f028216d9933a43ea3"
                },
                {
                    "data": "Incididunt ad deserunt eiusmod Lorem culpa Lorem minim amet culpa id.",
                    "name": "Mamie",
                    "code": "F022C7",
                    "color": "blue",
                    "groupId": "554fd0f0f7013c28d19e042d",
                    "id": "554fd0f063c8fee3581cb813"
                },
                {
                    "data": "Non duis Lorem id ad incididunt aliquip eu ea enim officia.",
                    "name": "Church",
                    "code": "F0CFDC",
                    "color": "orange",
                    "groupId": "554fd0f037a12cf3b2a2ecc8",
                    "id": "554fd0f0dbb01687dea1c5da"
                }
            ],
            "name": "List 3 Name",
            "id": "554fd0f02c598dfaa322d13b"
        },
        {
            "cards": [
                {
                    "data": "Nulla ipsum est minim ex aute labore labore do id elit nisi elit.",
                    "name": "Hilary",
                    "code": "F08176",
                    "color": "green",
                    "groupId": "554fd0f05ace54173870ed9e",
                    "id": "554fd0f0ca9b95dc8e7b68a6"
                },
                {
                    "data": "Irure culpa mollit do quis commodo esse aliqua est excepteur anim aliqua incididunt do velit.",
                    "name": "Mejia",
                    "code": "F0B481",
                    "color": "orange",
                    "groupId": "554fd0f0f1ef771f759d4795",
                    "id": "554fd0f0336b211ab15d48c4"
                }
            ],
            "name": "List 4 Name",
            "id": "554fd0f0be28b06494949aec"
        },
        {
            "cards": [
                {
                    "data": "Ullamco labore dolore magna ex ea est.",
                    "name": "Parrish",
                    "code": "F046DD",
                    "color": "orange",
                    "groupId": "554fd0f052385013f99c030c",
                    "id": "554fd0f053d81cfc5b7438ea"
                },
                {
                    "data": "Veniam nostrud est sit ut ex culpa ut deserunt duis.",
                    "name": "Decker",
                    "code": "F0EFA3",
                    "color": "green",
                    "groupId": "554fd0f0f6a0832abb80df71",
                    "id": "554fd0f02aa83cd8b30a4b5f"
                },
                {
                    "data": "Ullamco proident consectetur ipsum ullamco cupidatat sint magna id ex nisi est id irure.",
                    "name": "Antoinette",
                    "code": "F01B23",
                    "color": "blue",
                    "groupId": "554fd0f099913dff3e011fd1",
                    "id": "554fd0f0c3a75357aafe28f4"
                }
            ],
            "name": "List 5 Name",
            "id": "554fd0f0d906bb6056159e00"
        }
    ],
    "name": "Swim Lane 1",
    "index": 0,
    "id": "554fd0f064c78291b0e01114"
});