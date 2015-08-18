(function() {
  var app = angular.module("BoardgameViewer");

  var NavController = function($scope) {
    $scope.isCollapsed = true;  // for responsive design initial menu state for small devices
  };

  app.controller("NavController", NavController);

}());
