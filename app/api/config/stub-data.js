angular.module('kanban-control').run(function ($rootScope, hostedStub, $http) {
    var url = 'http://beta.json-generator.com/api/json/get/Px6fIEL';
    $http.get(url, {cache: false}).then(function (response) {
        $rootScope.config = response.data;
    }, function () {
        $rootScope.config = hostedStub;
    });
}).value('hostedStub', {
    'columns': [
        {
            'cards': [
                {
                    'type': 'type 2',
                    'priority': 'High',
                    'assignability': true,
                    'description': 'Dolor excepteur consectetur amet esse exercitation cupidatat do id nulla.',
                    'modified': '2015-02-07T05:24:17.800Z',
                    'created': '2015-03-18T10:29:04.250Z',
                    'groupId': '55526cf724b381d1ad3889af',
                    'assignee': 'Pittman Valenzuela',
                    'owner': 'Mercer Hart',
                    'state': 'green',
                    'name': 'Wilson',
                    'code': 76,
                    'color': 'green',
                    'app': 'glyph-sr-logo',
                    'id': '55526cf72cef60bbfedc66aa'
                },
                {
                    'type': 'type 2',
                    'priority': 'Low',
                    'assignability': true,
                    'description': 'Amet et eiusmod sunt non aliquip est exercitation sit dolor incididunt deserunt.',
                    'modified': '2015-04-24T01:43:20.824Z',
                    'created': '2015-05-10T13:27:02.381Z',
                    'groupId': '55526cf78aff3df46f7168c3',
                    'assignee': 'Margarita Hinton',
                    'owner': 'Rivers Carroll',
                    'state': 'green',
                    'name': 'Yates',
                    'code': 77,
                    'color': 'green',
                    'app': 'glyph-subtext-logo',
                    'id': '55526cf77f79e0e6d604cf43'
                }
            ],
            'name': 'List 1 Name',
            'id': '55526cf70e6858be78bc23cb'
        },
        {
            'cards': [
                {
                    'type': 'type 2',
                    'priority': 'Low',
                    'assignability': false,
                    'description': 'In voluptate irure aliqua deserunt elit consectetur reprehenderit veniam quis.',
                    'modified': '2015-04-27T14:00:43.040Z',
                    'created': '2015-02-08T08:29:16.672Z',
                    'groupId': '55526cf7bca2eb2b59154218',
                    'assignee': 'Oneil Anderson',
                    'owner': 'Mcknight Chandler',
                    'state': 'orange',
                    'name': 'Natalie',
                    'code': '7F',
                    'color': 'orange',
                    'app': 'glyph-star-logo',
                    'id': '55526cf7598fdebca5ff991f'
                },
                {
                    'type': 'type 2',
                    'priority': 'High',
                    'assignability': true,
                    'description': 'Eiusmod qui in proident voluptate sit commodo anim laborum et culpa ad.',
                    'modified': '2015-03-26T14:53:37.964Z',
                    'created': '2015-02-04T18:12:34.396Z',
                    'groupId': '55526cf777c8eba5971526a9',
                    'assignee': 'Eloise Cote',
                    'owner': 'Chandra Poole',
                    'state': 'blue',
                    'name': 'Peggy',
                    'code': 71,
                    'color': 'green',
                    'app': 'glyph-kw-logo',
                    'id': '55526cf7b29a7f984a161d90'
                }
            ],
            'name': 'List 2 Name',
            'id': '55526cf7a7721d577afae963'
        },
        {
            'cards': [
                {
                    'type': 'type 2',
                    'priority': 'High',
                    'assignability': true,
                    'description': 'Excepteur sint nisi proident magna pariatur fugiat eiusmod laborum ut laborum cillum labore ea consectetur.',
                    'modified': '2015-02-27T12:12:43.539Z',
                    'created': '2015-01-06T21:48:46.195Z',
                    'groupId': '55526cf76ec6d59934649c51',
                    'assignee': 'Pruitt Riddle',
                    'owner': 'Neva Roy',
                    'state': 'green',
                    'name': 'Marsh',
                    'code': 72,
                    'color': 'orange',
                    'app': 'glyph-am1-logo',
                    'id': '55526cf7ba745356dcd9fa05'
                },
                {
                    'type': 'type 1',
                    'priority': 'High',
                    'assignability': true,
                    'description': 'Tempor eu qui enim do velit laboris reprehenderit ex eiusmod.',
                    'modified': '2015-03-23T19:33:49.537Z',
                    'created': '2015-01-12T19:52:11.270Z',
                    'groupId': '55526cf7bffaafbe6c54f976',
                    'assignee': 'Sheena Shannon',
                    'owner': 'Roberson Mercado',
                    'state': 'green',
                    'name': 'Shields',
                    'code': '7B',
                    'color': 'blue',
                    'app': 'glyph-mff-logo',
                    'id': '55526cf78ea51f2bc045ad6c'
                },
                {
                    'type': 'type 3',
                    'priority': 'Low',
                    'assignability': false,
                    'description': 'Tempor excepteur do non officia aute nisi consectetur magna.',
                    'modified': '2015-04-24T07:19:48.522Z',
                    'created': '2015-04-06T10:58:33.642Z',
                    'groupId': '55526cf7eb5d09529687ef46',
                    'assignee': 'Lauren Wall',
                    'owner': 'Mcbride Talley',
                    'state': 'green',
                    'name': 'Delaney',
                    'code': '7F',
                    'color': 'blue',
                    'app': 'glyph-am1-logo',
                    'id': '55526cf72e5a136007978039'
                },
                {
                    'type': 'type 1',
                    'priority': 'Medium',
                    'assignability': false,
                    'description': 'Aliquip aute aliquip do qui adipisicing ipsum exercitation ullamco ipsum voluptate sint.',
                    'modified': '2015-01-21T00:41:51.812Z',
                    'created': '2015-04-06T11:18:53.929Z',
                    'groupId': '55526cf74b7eb431ac105f06',
                    'assignee': 'Trevino Keith',
                    'owner': 'Martha Odom',
                    'state': 'green',
                    'name': 'Cobb',
                    'code': 75,
                    'color': 'green',
                    'app': 'glyph-mff-logo',
                    'id': '55526cf72f0e80e0383bb6b0'
                }
            ],
            'name': 'List 3 Name',
            'id': '55526cf73a480d5dcf6b06bb'
        },
        {
            'cards': [
                {
                    'type': 'type 1',
                    'priority': 'High',
                    'assignability': true,
                    'description': 'Adipisicing in ex occaecat consectetur commodo amet magna commodo eu in non.',
                    'modified': '2015-03-04T10:07:50.554Z',
                    'created': '2015-02-19T04:26:28.269Z',
                    'groupId': '55526cf725713eb3d0ad08d6',
                    'assignee': 'Krystal Vincent',
                    'owner': 'Rochelle Glover',
                    'state': 'blue',
                    'name': 'English',
                    'code': '7C',
                    'color': 'green',
                    'app': 'glyph-am1-logo',
                    'id': '55526cf7a3e30045c8fb1c5a'
                },
                {
                    'type': 'type 3',
                    'priority': 'Medium',
                    'assignability': false,
                    'description': 'Aute eu ipsum aliqua culpa est quis id.',
                    'modified': '2015-01-28T19:45:40.654Z',
                    'created': '2015-01-24T13:15:23.896Z',
                    'groupId': '55526cf7287c3502a305226b',
                    'assignee': 'Cotton Lopez',
                    'owner': 'Josefa Hull',
                    'state': 'green',
                    'name': 'Herrera',
                    'code': '7A',
                    'color': 'green',
                    'app': 'glyph-eiaf-logo',
                    'id': '55526cf74d349790cd618e60'
                },
                {
                    'type': 'type 2',
                    'priority': 'High',
                    'assignability': false,
                    'description': 'Labore anim proident occaecat eu.',
                    'modified': '2015-01-26T01:04:38.798Z',
                    'created': '2015-03-30T04:16:47.968Z',
                    'groupId': '55526cf7c41b1fc990f6384d',
                    'assignee': 'Trisha Glass',
                    'owner': 'Jennifer Sykes',
                    'state': 'blue',
                    'name': 'Strong',
                    'code': 72,
                    'color': 'green',
                    'app': 'glyph-am1-logo',
                    'id': '55526cf74bde9146ec103361'
                }
            ],
            'name': 'List 4 Name',
            'id': '55526cf7af2e989da1058a1f'
        },
        {
            'cards': [
                {
                    'type': 'type 1',
                    'priority': 'Medium',
                    'assignability': true,
                    'description': 'Laboris irure ullamco ipsum tempor nulla nulla aute irure consequat.',
                    'modified': '2015-01-29T03:41:33.898Z',
                    'created': '2015-02-15T23:05:53.709Z',
                    'groupId': '55526cf790ad131e215442a9',
                    'assignee': 'Franks Coffey',
                    'owner': 'Boyd Bray',
                    'state': 'blue',
                    'name': 'Heath',
                    'code': '7B',
                    'color': 'green',
                    'app': 'glyph-kw-logo',
                    'id': '55526cf7321f863586c50575'
                },
                {
                    'type': 'type 1',
                    'priority': 'Medium',
                    'assignability': false,
                    'description': 'Ex enim pariatur incididunt qui dolor deserunt aute consequat commodo.',
                    'modified': '2015-01-01T01:49:33.132Z',
                    'created': '2015-03-01T16:09:01.737Z',
                    'groupId': '55526cf758ab1ac03e45aea7',
                    'assignee': 'Angel Howell',
                    'owner': 'Alston Riley',
                    'state': 'blue',
                    'name': 'Virginia',
                    'code': 70,
                    'color': 'blue',
                    'app': 'glyph-sr-logo',
                    'id': '55526cf75ec20ad8e75fb2f2'
                },
                {
                    'type': 'type 3',
                    'priority': 'Low',
                    'assignability': true,
                    'description': 'Est et ut ea minim incididunt mollit et aliqua tempor dolore est exercitation quis nostrud.',
                    'modified': '2015-04-26T18:11:19.098Z',
                    'created': '2015-04-12T01:33:11.150Z',
                    'groupId': '55526cf709a85d0d99a838f5',
                    'assignee': 'Carole Todd',
                    'owner': 'Dina Bowers',
                    'state': 'orange',
                    'name': 'Jodie',
                    'code': 75,
                    'color': 'orange',
                    'app': 'glyph-star-logo',
                    'id': '55526cf7dc6264b1a89210be'
                }
            ],
            'name': 'List 5 Name',
            'id': '55526cf77776496dcaed11d7'
        }
    ],
    'name': 'Swim Lane 1',
    'index': 0,
    'id': '55526cf7fa30d3f536032983'
});