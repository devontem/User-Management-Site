angular.module('userApp', ['ngAnimate', 'app.routes', 'authService', 'mainCtrl', 'userCtrl', 'userService'])

//application configuration to integrate token into every request
.config(function($httpProvider){
    
    //attach our factory 'auth interceptor' to every http request
    $httpProvider.interceptors.push('AuthInterceptor');
    
});