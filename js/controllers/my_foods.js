var app = angular.module('foodsApp');

// ##############################################################################
//                          CONTROLLER - ALERT
// ##############################################################################

app.controller('My_Foods', ['$scope', 'api', '$log', '$rootScope', 'sData', '$cookies', '$timeout', 
	function($scope, $api, $log, $rootScope, sData, $cookies, $timeout){
  $scope.sData = sData;
  $scope.alerts = [];
  $scope.food = {}

  $scope.go_alert = function (_id){
    console.log("Cargando alertas: " + _id + " token: " + $cookies.password)
    $api.get_alerts_food({food_id:_id}, {Authorization:$cookies.password })
    .then(function (response){
      $scope.alerts = response.data.alerts;
      console.log("alertas...")
      console.log(response.data.alerts)
      // 
    })
    .then(function (){
    	console.log("agregando objetos");
      angular.forEach($scope.alerts, function(value, key){ 
        $scope.alerts[key] = value;       
        $api.food({food_id:value.food_id})
        .then(function(response) {          	
        	$scope.alerts[key].food = response.data.Food;
        }).then(function (){
        	$api.get_user_id({_id:value.sender_id}, {Authorization: $cookies.password})
          .then(function (response){
            $scope.alerts[key].sender = response.data.user;                        
          })	          
        })
        
      })        
    })
    .then(function (){
    	$scope.sData.my_alerts = $scope.alerts;
      // $.mobile.navigate("#alerts_food", { transition: "slide", changeHash: false });
      console.log("print my_alerts:...")
      console.log($scope.sData.my_alerts)
      nav.pushPage("alerts_food.html", { animation: "slide", changeHash: true });

    })
  } 
  
  $scope.chat = function (alert){
  	$api.get_alert_sender({food_id:alert.food._id, sender_id: alert.sender._id}, {Authorization:$cookies.password })
    .then(function(response){
      console.log("Imprimeiendo alerts")
      console.log($scope.sData.alert)
      $scope.sData.messages = response.data.alert.message;
      console.log("Imprimeiendo messages")
      console.log($scope.sData.messages)
      $scope.sData.food = alert.food;    	
      $scope.sData.sender = false;
      $scope.sData.sender_id = alert.sender_id;
      $scope.sData.loading = true;
      // $.mobile.navigate("#alert", { transition: "flip", changeHash: true });
      nav.pushPage("alert.html", { animation: "slide", changeHash: true });
    }, function (){
    	console.log("NO pudo buscar..")
    })  	
  }

  $scope.deleted_food = function (food){
    $scope.food = food;
    deleted_food.show();
  }
   $scope.close = function (food){
    console.log("close")
    deleted_food.hide();
  }

  $scope.deleted = function (){
  	console.log("Empezando a eliminar..")
    $api.deleted_food({food_id:$scope.food._id}, {Authorization:$cookies.password })
    .then(function (){
    	console.log("Ha eliminado " + $scope.food.name + "!")
    	$api.food_user({user_id:$scope.sData.user._id})
	    .then(function(response) {
	    	console.log("actualizando my_foods...")
	      $scope.sData.my_foods = response.data.Foods;
	      // $.mobile.navigate("#my_foods", { rel: "back", changeHash: true });
        deleted_food.hide();
        nav.pushPage("my_foods.html", { animation: "slide", changeHash: false });
	    })
    })
  }

}])