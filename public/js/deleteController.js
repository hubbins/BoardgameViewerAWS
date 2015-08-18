(function() {
  var app = angular.module("BoardgameViewer");

  var DeleteController = function($scope, $http, $routeParams) {
    var serviceUrl = "/api/game";

    $http.delete(serviceUrl + "/" + $routeParams.id).
      success(function(data, status, headers, config) {
        //console.log(data);
      }).
      error(function(data, status, headers, config) {
        alert("Error");
      });
  };

  app.controller("DeleteController", DeleteController);

}());