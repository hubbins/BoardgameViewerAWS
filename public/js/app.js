(function(){
  var appModule = angular.module("BoardgameViewer", ["ngRoute", "ui.bootstrap"]);
  
  // configure routes
  appModule.config(['$routeProvider', function ($routeProvider, $httpProvider) {
    $routeProvider.
    when('/', {
      templateUrl: '/templates/index.html',
      controller: 'IndexController'
    }).
    when('/list', {
      templateUrl: '/templates/list.html',
      controller: 'ListController'
    }).
    when('/add', {
      templateUrl: '/templates/add.html',
      controller: 'AddController'
    }).
    when('/delete/:id', {
      templateUrl: '/templates/delete.html',
      controller: 'DeleteController'
    })
  }]);

  // don't cache ajax responses
  appModule.config(['$httpProvider', function($httpProvider) {
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};    
    }    
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
  }]);
    
}());
