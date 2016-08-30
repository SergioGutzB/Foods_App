var app = angular.module('foodsApp', [
  'FoodsService',
  'CookiesService',
  'ngCookies',   
  'UserValidation',
  'ngAutocomplete',
  'angucomplete',
  'ngFileUpload',
  'ngMap',
  'ServeData',
  'onsen',
])
.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.headers.common = 'Content-Type: application/json';
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.common["Accept"] = "application/json";
    $httpProvider.defaults.headers.common["Content-Type"] = "application/json";
    }
])
