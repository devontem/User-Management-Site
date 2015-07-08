//creating the userServices module
angular.module('userService', [])
    
    //creating factory called 'User', injecting dependency on $http module
    .factory('User', function($http){
        
        //creates a new object
        var userFactory = {};
        
        //get a single user
        userFactory.get = function(id){
            return $http.get('/api/users/' + id);
        };
        
        //get all users
        userFactory.all = function(){
            return $http.get('/api/users/');  
        };
        
        //create a user
        userFactory.create = function(userData){
            return $http.post('/api/users/', userData);  
        };
        
        //update a user
        userFactory.update = function(id, userData){
            return $http.put('/api/users/' + id, userData);  
        };
        
        //delete a user
        userFactory.delete = function(id){
            return $http.delete('/api/users/' + id);
        };
        
        //return object so methods can be called as: 'User.get', 'User.create', etc.
        return userFactory;
    });