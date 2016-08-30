var app = angular.module('foodsApp');
// ##############################################################################
//                          CONTROLLER - FOOD
// ##############################################################################

app.controller('Food', 
  ['$scope', '$http', 'api', '$log', 'NgMap', '$timeout', 'sData', '$cookies', '$interval',
  function($scope, $http, $api, $log, NgMap, $timeout, sData, $cookies,$interval, auth){
  $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyA5HaNn4glGwHp0oDiQfU5C8T2yMdkhJeU";
  $scope.sData = sData;
  $scope.center = "";
  $scope.destination = "";  
  var mapInit = false;
  
  $scope.$watch('sData.food', function (){
    $scope.destination =  $scope.sData.food.lat + ',' +  $scope.sData.food.lng;
    $scope.center =  $scope.sData.pos.lat + ',' +  $scope.sData.pos.lng;

    if ($scope.sData.food.name != undefined){  
      $scope.travelMode = 'TRANSIT';    
      $timeout(function() {
        console.log("cargando mapa  en: " + $scope.center)
        console.log("destino:  " + $scope.destination)
        $scope.initMap('map');
        $scope.travelMode = 'DRIVING';
        mapInit = true;
      }, 400);  
    }
  })

  $scope.travel = function(mode) {
    $scope.travelMode = mode;
  }

  $scope.initMap = function(mapId) {
    console.log(mapId)
    if(!$scope.sData.loading)
      map = NgMap.initMap(mapId);
  }

  $scope.data = {}
  $scope.headers = {}
  $scope.alerts = {} 
  $scope.messages = {}
  var msg = []

  $scope.comprobar = function () {
    if ($cookies.password != undefined) {
      console.log("esta loqgueado")
    } else {      
      console.log("no esta logueado..")
      // $.mobile.navigate("#foods",{ transition: "slideup", changeHash: false });
      nav.pushPage("foods.html", { animation: "slide" });
    }  
  }
   var bajar;
   bajar = function (){
    $("#cont-msg").animate({ scrollTop: $('#cont-msg').scrollTop()}, 500);
  }

  $scope.getAlerts = function() {
    $scope.sData.messages = {}
    console.log("obteniendo alertar...")
    console.log($scope.sData.user)
    console.log(sData.food)
    if (!$.isEmptyObject($scope.sData.user)) {
      if ($scope.sData.user._id != sData.food.user_id) {
        $scope.headers.Authorization = $cookies.password;
        var al;
        if ($scope.sData.sender) {
          al = $api.get_alert_sender({food_id:sData.food._id, sender_id: sData.user._id},$scope.headers)
        } else {
          al = $api.get_alerts_food({food_id:sData.food._id}, $scope.headers)
        }

        al.then(function(response){
          console.log(response)
          try{
            if (response.data.alert) {
              $scope.sData.messages = response.data.alert.message;
              bajar();
            }
          } catch(e) {
            console.log("Error procesando: "+ e)
          }        
          console.log($scope.alerts)        
        }, function (){
          console.log("No pudo encontrar alertas..")
        })
        .then(function () {
          $scope.sData.loading = true;
          bajar();
          nav.pushPage("alert.html", { animation: "slide", changeHash: true });          
        })
      } else {
        ons.notification.alert('No puede enviar una alerta a un alimento propio!');
      }
    } else {
       ons.notification.alert('Debe iniciar sesión para enviar una alerta');
      $scope.sData.url = "alert.html";
      nav.pushPage("login.html", { animation: "slide", changeHash: false });
    }  
  }
        
  $scope.send = function (sender) { 
    console.log("Sender bolean: " + sender)
    var alerta = {}
    if (sender) {
      $scope.data.food_id = sData.food._id
      $scope.data.sender_id = sData.user._id
      $scope.data.user_id = sData.food.user_id  
    } else {
      $scope.data.food_id = sData.food._id
      $scope.data.sender_id = $scope.sData.sender_id
      $scope.data.user_id = sData.food.user_id
    }    
    console.log("sender usuario: " + $scope.data.sender_id  ) 
    console.log("food_id: " + $scope.data.food_id) 
    console.log("user_id: " +  $scope.data.user_id )

    if ($cookies.password != undefined) {
      $api.get_alert_sender($scope.data,{Authorization: $cookies.password})
      .then(function (response){
        console.log("entonctro algo...")
        console.log(response)
        if (response.data.success){
          console.log("se metió...")
          alerta = response.data.alert;          
          alerta.message.push({msg:$scope.data.message, date:(new Date), sender:sender})
          console.log("imprimiendo alerta")
          console.log(alerta);
          $api.save_alert(alerta,{Authorization: $cookies.password})
          .then(function (){
            // $scope.getAlerts();
            $scope.data.message = "";
            bajar();

          })
        } else {
          var a_aux = [];
          a_aux.push({msg:$scope.data.message, date:(new Date), sender:sender} )
          $scope.data.message = a_aux;
          $api.send_alert($scope.data,{Authorization: $cookies.password})
          .then(function (){
            // $scope.getAlerts();
            $scope.data.message = "";
            bajar();
          })
        }
      }, function (){
        var a_aux = [];
        a_aux.push({msg:$scope.data.message, date:(new Date), sender:sender} )
        $scope.data.message = a_aux;
        $api.send_alert($scope.data,{Authorization: $cookies.password})
        .then(function (){
          // $scope.getAlerts();
          $scope.data.message = "";
          bajar();
        })
      })
    } else {
      $scope.sData.url = "alert.html"
      nav.pushPage("login.html", { animation: "slide", changeHash: false });
    }

  }

  $scope.$watch('sData.loading', function (){
    console.log("sData.loading" + sData.loading)
    bajar();
    if ($scope.sData.loading == true) {
      $scope.refresh();
    }
  })

  $scope.$watch('sData.messages', function (){
    // bajar()
  });  
  var promise;
  $scope.refresh = function () {
    $scope.loading = true;
    promise = $interval(function (){
      if ($scope.sData.loading == true) {      
        $api.get_alerts_food({food_id:$scope.sData.food._id}, {Authorization:$cookies.password })
        .then(function(response){
          try{
            if (response.data.alerts[0]) {
              if(response.data.alerts[0].length != $scope.sData.messages.length) {
                $scope.sData.messages = response.data.alerts[0].message;
              }
            }
          } catch(e) {
            console.log("Error procesando: "+ e)
          } 
        })
      }
    }, 3000)
  }

  $scope.stop = function (){
    $scope.sData.loading = false;
    $interval.cancel(promise);
  }

  $scope.deleted = function () {

  }

  $scope.share = function () {
    // if ($scope.sData.alerta.sender_id == $scope.sData.user._id )
    //   $api.update_alert({data_sender:true}, {Authorization:$cookies.password })
    // else if ($scope.sData.alerta.user_id == $scope.sData.user._id)
    //   $api.update_alert({data_user:true}, {Authorization:$cookies.password })
  }

  $scope.view_data = function (){
    
  }
  
  bajar();
}])