angular
  .module('FoodsService',['ngFileUpload'])

	.factory('api', ['$http', 'Upload', '$timeout', function ($http, Upload, $timeout) {
		var url = "http://54.187.17.15:8080"; // http://localhost:8080 -  http://54.187.17.15:8080

		return {
			foods: function(){
				var path = url + "/api/foods"; 				
				global = $http({
			  	method: 'GET',
			  	url: path
			  })
				return global;
			},

			food: function(data){
				var path = url + "/api/food"; 				
				global = $http({
			  	method: 'POST',
			  	url: path,
			  	data: data
			  })
				return global;
			},

			food_user: function(data){
				var path = url + "/api/foods_user"; 				
				global = $http({
			  	method: 'POST',
			  	url: path,
			  	data: data
			  })
				return global;
			},

			distance: function(rootlat, rootlng, lat, lng){
        var path = "http://maps.googleapis.com/maps/api/distancematrix/json";
				global = $http({
			  	method: 'GET',
			  	url: path,
			  	params: {
			  		origins:rootlat + "," + rootlng,
			  	  destinations:lat + "," + lng
			  	},
			  	headers: {
			  		'Access-Control-Allow-Origin' : '*',
			    }
			  })
				return global;
			},

			mostrar: function() {
				return "estamos mostrando desde el servicio";
			},

			save_user: function(data) {
				var path = url + "/api/signup" ;
				global = $http({
					method: "POST",
					url: path,
					data: data
				});
				return global;
			},

			authenticate: function(data) {
				var path = url + "/api/authenticate" ;
				global = $http({
					method: "POST",
					url: path,
					data: data
				});
				return global;
			}, 

			add_food: function(data, head) {
				var path = url + "/api/addFood" ;
				global = $http({
					method: "POST",
					url: path,
					data: data,
					headers: head
				});
				return global;
			},  

			deleted_food: function(data, head) {
				var path = url + "/api/deleted_food" ;
				global = $http({
					method: "POST",
					url: path,
					data: data,
					headers: head
				});
				return global;
			}, 

			upload: function (data, file, head) {
				var path = url + "/api/addFood" ;
				var d = {}
			  d = data;
        d.file = file;
        global = Upload.upload({
		      url: path,
		      data: d,
		      headers: head
		    });
				return global
			}, 

			send_alert: function(data, head) {
				var path = url + "/api/send_alert" ;
				global = $http({
					method: "POST",
					url: path,
					data: data,
					headers: head
				});
				return global;
			}, 

			update_alert: function(data, head) {
				var path = url + "/api/update_alert" ;
				global = $http({
					method: "POST",
					url: path,
					data: data,
					headers: head
				});
				return global;
			}, 

			get_alerts: function(data, head) {
				var path = url + "/api/alerts" ;
				global = $http({
					method: "POST",
					url: path,
					data: data,
					headers: head
				});
				return global;
			},

			get_alerts_id: function(data, head) {
				var path = url + "/api/alerts_id" ;
				global = $http({
					method: "POST",
					url: path,
					data: data,
					headers: head
				});
				return global;
			},

			get_alerts_food: function(data, head) {
				var path = url + "/api/alerts_food" ;
				global = $http({
					method: "POST",
					url: path,
					data: data,
					headers: head
				});
				return global;
			},

			get_alert_sender: function(data, head) {
				var path = url + "/api/alerts_sender" ;
				global = $http({
					method: "POST",
					url: path,
					data: data,
					headers: head
				});
				return global;
			},

			save_alert: function(data, head) {
				var path = url + "/api/update_alert" ;
				global = $http({
					method: "POST",
					url: path,
					data: data,
					headers: head
				});
				return global;
			},

			get_user: function(head) {
				var path = url + "/api/user" ;
				global = $http({
					method: "GET",
					url: path,
					headers: head
				});
				return global;
			},

			get_user_id: function(data, head) {
				var path = url + "/api/user_id" ;
				global = $http({
					method: "POST",
					url: path,
					data: data,
					headers: head
				});
				return global;
			},

		};
}])
