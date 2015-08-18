(function() {
  var app = angular.module("BoardgameViewer");

  var AddController = function($scope, $http, $location) {
    var serviceUrl = "/api/game";

    var blankGame = {
      Name: "",
      NumberOfPlayers: "",
      BGGLink: "",
      Comment:""
    };

    $scope.saveGame = function() {
      $http.post(serviceUrl, $scope.game)
        .success(function (result) {
          //alert(result.Status + " " + $scope.game.Name);
          $location.path("list");   // redirect to list after adding a game
        });
    };

    $scope.game = angular.copy(blankGame);
  };

  app.controller("AddController", AddController);

}());
