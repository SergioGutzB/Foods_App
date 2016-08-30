var app = angular.module('foodsApp');

// ##############################################################################
//                          CONTROLLER - SIGNUP
// ##############################################################################

app.controller('signup', ['$scope', '$http', 'api', function($scope, $http, $api){
  $scope.result2 = '';
  $scope.options2 = {
    country: 'co',
    types: '(cities)'
  };
  $scope.details2 = '';

  $scope.options1 = {
    country: 'co',
    types: 'address'
  };

  $scope.details1 = '';

  $scope.save_user = function (completed, view) {
    if (completed) {
      $scope.user.postal_code = $scope.details1.address_components[7].short_name;
      $scope.user.lat = $scope.details1.geometry.location.lat;
      $scope.user.log = $scope.details1.geometry.location.lng;
      $api.save_user($scope.user)
      .then(function(response){
        token = response;
        console.log(response);
        $scope.reset();
        // $.mobile.navigate(view, { transition: "slide", changeHash: false });
        nav.pushPage(view, { animation: "slide", changeHash: false });
      });
    } else {
      console.log($scope.user);
      // $.mobile.navigate(view, { transition: "slide", changeHash: false });   
      nav.pushPage(view, { animation: "slide", changeHash: false });  
    }    
  }

  $scope.reset = function (form) {
    $scope.user = {}
    if (form) {
      form.$setPristine();
      form.$setUntouched();
    }
  }
  // $scope.reset();

}])
