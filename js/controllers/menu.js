var app = angular.module('foodsApp')

app.controller('Menu', ['$scope', 'api', 'sData','auth',  function($scope, $api, sData, $auth) {
  ons.ready(function() {
  });
  $scope.sData = sData;

  $scope.load = function(page) {
    nav.pushPage(page, { animation: "slide" });
      menu.left.close();
    // });
  };

  $scope.load_pop = function(page) {
    nav.popPage(page, { animation: "slide" });
      menu.left.close();
    // });
  };

  

  $scope.get_my_foods  = function (){
    $api.food_user({user_id:$scope.sData.user._id})
    .then(function(response) {
      $scope.sData.my_foods = response.data.Foods;
      // $.mobile.navigate("#my_foods", { transition: "slide", changeHash: true });
      nav.pushPage("my_foods.html", { animation: "slide", changeHash: false });
    })
  }

  $scope.logout = function (){
    console.log("cerrando sessión")
    $scope.sData.user = {}
    $auth.logout();
    // $.mobile.navigate("#foods" ,{ rel: "back", changeHash: false });
    nav.pushPage("foods.html", { animation: "slide", changeHash: false });
  }


}]);