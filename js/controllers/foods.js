var app = angular.module('foodsApp');

app.config(['$httpProvider',function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
 }])
app.run(function($rootScope) {
    $rootScope.food_id = "5724198b1c9330540f1b207b";
})

// ##############################################################################
//                          CONTROLLER - FOODS
// ##############################################################################

app.controller('Foods', ['$scope', 'api', '$log', '$cookies', 'auth', 'NgMap', '$timeout', 'sData', '$q',
  function($scope, $api, $log, $cookies, $auth, NgMap, $timeout, sData, $q){
  $scope.sData = sData;

  var getAllFoods = function() {
  	$api.foods()
    .then(function(response) {
	    $scope.foods = response.data.Foods;
      console.log("Se obuto foods")           
	  }, function(response){
	    console.log("Error al cargar la lista de alimentos");
	    $log.info(response);
	  })
    .then(function(response){
      angular.forEach($scope.foods, function(value, key){          
        $api.distance($scope.sData.pos.lat, $scope.sData.pos.lng, value.lat, value.lng)
          .then(function(response) {
            value.expires = value.expires.split("T")[0];
            try{
              value.distance = response.data.rows[0].elements[0].distance.text;
            } catch(e) {
              value.distance = "0 ";
            }
            
            value.distanceNum = getDistance(value.distance);
        }, function(response){
          console.log("error distance")
          $log.info(response);
        });
      });
      console.log("Se calcularon las distancia"); 
    });
  }


  $scope.$watch(sData.pos, function (){
    getAllFoods();
  })
  
  var location = function () {
    var options = { maximumAge: 500000, timeout: 5000, enableHighAccuracy: true };
    navigator.geolocation.getCurrentPosition(function (pos) {
      $scope.sData.pos.lat = pos.coords.latitude;
      $scope.sData.pos.lng = pos.coords.longitude;
    }, onError, options);
  }

  location();

  $scope.load = function ($done){
    $timeout(function(){
      console.log("loading...!")
      getAllFoods();
      $done();
    },1000);
  }
  
  $scope.location = function () {
    location();
  }
  
  $scope.update = function () {
    getAllFoods();
  }



  $scope.getFood = function(_id) {    
    console.log("Food_id: " + _id);
    $scope.sData.food = {}
    $api.food({food_id:_id})
      .then(function(response) {
        $scope.food = response.data.Food;
        $scope.destination = $scope.food.lat+','+$scope.food.lng;
        $scope.food.expires = $scope.food.expires.split("T")[0];
        $api.distance($scope.sData.pos.lat, $scope.sData.pos.lng, $scope.food.lat, $scope.food.lng)
        .then(function(response) {
          try{
            $scope.food.distance = response.data.rows[0].elements[0].distance.text;  
          }catch (e){
            console.log("GET error distance!",e);
            $scope.food.distance = "500m"
          }
                                         
        }, function(response){
          console.log("error distance")
          $log.info(response);
        })
        .then(function (){
          console.log("cargando food..")  
          $scope.sData.food = $scope.food;
          $scope.sData.sender = true;
          

          nav.pushPage("food.html", { animation: "slide" });
        })
        .then(function(){
          $('.brimg').css('background-image', 'url(../../images/bg1.jpg)');
        })
    }, function(response){
      console.log("error en authenticate")
      $log.info(response);
    })    
  }

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

  $scope.new = function (){
    if (!$.isEmptyObject($scope.sData.user)) {
      nav.pushPage("new_food.html", { animation: "slide", changeHash: false });
    } else {
      ons.notification.alert('Debe iniciar sesión para publicar un alimento');
      nav.pushPage("login.html", { animation: "slide", changeHash: false });
    }
  }

}])



// ##############################################################################
//                          CONTROLLER - USER
// ##############################################################################

app.controller('User', ['$scope', 'api', '$log', '$rootScope', 'sData', function($scope, $api, $log, $rootScope, sData){
    $scope.sData = sData;
    $scope.lat = $scope.sData.user.lat;
    $scope.lng = $scope.sData.user.lng;  
}])

/////////////////////////////////////////////////////////////////////////////
                        // FUNCIONES GENERALES
////////////////////////////////////////////////////////////////////////////

function onError(error) {
  console.log('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
}
app.controller('Mapa', ['$scope', 'NgMap', function ($scope, NgMap) {
  $scope.initMap = function(mapId) {
    map = NgMap.initMap(mapId);
  }
}])

function getDistance(distance) {
  var cant = parseFloat(distance.split(" ")[0]);
  var units = distance.split(" ")[1];
  if (units == "km"){
    cant = cant*1000;
  }
  return cant;
}