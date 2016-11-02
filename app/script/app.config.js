app.config([
    '$routeProvider',
    function ($routeProvide) {
        $routeProvide
            .when('/', {
                templateUrl: 'templates/auth.tpl.html',
                controller: 'AuthCtrl'
            })
            .when('/reg', {
                templateUrl: 'templates/reg.tpl.html',
                controller: 'RegCtrl'
            })
            .when('/lk', {
                templateUrl: 'templates/lk.tpl.html',
                controller: 'LkCtrl',
                auth: true
            })
            .otherwise({
                redirectTo: '/'
            });
    }
]);