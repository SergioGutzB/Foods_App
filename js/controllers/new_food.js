var app = angular.module('foodsApp');

// ##############################################################################
//                          CONTROLLER - NEW_FOOD
// ##############################################################################

app.controller('new_food', ['$scope', 'api', '$cookies','$timeout', 'sData', 
  function($scope, $api, $cookies, $timeout, sData ){
  $scope.headers = {};
  $scope.f = {};
  $scope.sData = sData;

  $scope.add2 = function (completed, file) {
    console.log("user: ")
      console.log( $scope.sData.user)

    if (completed) {
      $scope.sData.food = $scope.food;
      $scope.sData.food.lat = $scope.sData.pos.lat;
      $scope.sData.food.lng = $scope.sData.pos.lng;       
      $scope.headers.Authorization = $cookies.password;
      console.log($scope.sData.food)
      $api.upload($scope.sData.food, file, $scope.headers)
      .then(function(response){
          $scope.f.result = response.data;
          // $rootScope.food = {}
          $scope.sData.food = {}
          $scope.f = {};
          $scope.reset();
          // $.mobile.navigate("#foods", { transition: "slide", changeHash: false });
          nav.pushPage("foods.html", { animation: "slide", changeHash: false });
       
      }, function (response) {
      if (response.status > 0)
        $scope.errorMsg = response.status + ': ' + response.data;
      }, function (evt) {
        // Math.min is to fix IE which reports 200% sometimes
        $scope.f.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
    } else {
      console.log($scope.food);
      $scope.sData.food = $scope.food;
      // $.mobile.navigate("#new_food2", { transition: "slide", changeHash: true });
      // nav.pushPage("foods.html", { animation: "slide", changeHash: false });
    }
  } 

  $scope.reset = function (form) {
    $scope.food = {}
    if (form) {
      form.$setPristine();
      form.$setUntouched();
    }
  }
  $scope.reset();

}])