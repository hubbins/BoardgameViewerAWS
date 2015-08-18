(function() {
  var app = angular.module("BoardgameViewer");

  var ListController = function($scope, $http) {
    var serviceUrl = "/api/games";
    var serviceUrlUser = "/api/user"

    $http.get(serviceUrl).
      success(function(data, status, headers, config) {
        $scope.games = data;
      }).
      error(function(data, status, headers, config) {
        alert("Error");
      });

    $http.get(serviceUrlUser).
      success(function(data, status, headers, config) {
        $scope.user = data;
      }).
      error(function(data, status, headers, config) {
        alert("Error");
      });
  };

  app.controller("ListController", ListController);

}());
