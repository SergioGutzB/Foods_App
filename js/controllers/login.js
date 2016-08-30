var app = angular.module('foodsApp');

// ##############################################################################
//                          CONTROLLER - LOGIN
// ##############################################################################

app.controller('login', ['$scope', 'api', 'auth', '$cookies', 'sData', function($scope, $api, $auth, $cookies, sData){
  $scope.sData = sData;
  $scope.sesion = {}

  $scope.login = function () {
    console.log("user..");
    console.log($scope.user);
    $api.authenticate($scope.user)
    .then(function(response){
      if (response.data.token) {
        $scope.sData.user.name = $scope.user.user_name;
        $scope.sData.user.token = response.data.token;
        $scope.sData.user._id = response.data._id;
        console.log($scope.sData.user)
        $auth.login($scope.sData.user.name, $scope.sData.user.token);
        if ($scope.sData.url != "") {
          console.log("navegando a: " + $scope.sData.url)
          // nav.pushPage("foods.html", { animation: "slide", changeHash: false });
          nav.popPage();
        } else {
          nav.popPage();
        }
        
        $scope.sData.url = "";
        // nav.pushPage("foods.html" ,{ animation: "slide", changeHash: false });

        $api.get_user({Authorization:$scope.sData.user.token})
        .then(function(response){
          $scope.sData.user._id = response.data.user._id;
          $scope.sData.user.email = response.data.user.email;
          $scope.sData.user.first_name = response.data.user.first_name;
          $scope.sData.user.last_name = response.data.user.last_name;
          $scope.sData.user.address = response.data.user.address;
          $scope.sData.user.phone = response.data.user.phone;
          $scope.reset();
          console.log("User full: ");
          console.log($scope.sData.user)
        }, function (){
          console.log("Usted no esta autorizado!   - token: " + $scope.sData.user.token)
        })
      } else {
        $scope.msg = "Los datos son incorrestos.";
        console.log("Los datos son incorrestos.")
        // $( "#no_login" ).popup()
        // $( "#no_login" ).popup( "open", { transition: "slideup", changeHash: false } )
      }
    })
  }

  $scope.reset = function (form) {
    $scope.user = {}
    if (form) {
      form.$setPristine();
      form.$setUntouched();
    }
  }

  $scope.reset();

}])