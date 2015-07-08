var config = require('../../config.js');//config details
var jwt = require('jsonwebtoken'); //web token tool
var User = require('../models/user'); //User Model

module.exports = function(app, express){
    
    /********************
      ROUTES FOR OUR API
    ********************/
    
    // get an instance of the express router
    var apiRouter = express.Router();
    
    //authenticating a user => /api/authenticate
    apiRouter.post('/authenticate', function(req, res) {
    
      // find the user
      User.findOne({
        username: req.body.username
      }).select('name username password').exec(function(err, user) {
    
        if (err) throw err;
    
        // no user with that username was found
        if (!user) {
          res.json({ 
            success: false, 
            message: 'Authentication failed. User not found.' 
          });
        } else if (user) {
    
          // check if password matches
          var validPassword = user.comparePassword(req.body.password);
          if (!validPassword) {
            res.json({ 
              success: false, 
              message: 'Authentication failed. Wrong password.' 
            });
          } else {
    
            // if user is found and password is right
            // create a token
            var token = jwt.sign({
            	name: user.name,
            	username: user.username
            }, config.superSecret, {
              expiresInMinutes: 1440 // expires in 24 hours
            });
    
            // return the information including token as JSON
            res.json({
              success: true,
              message: 'Enjoy your token!',
              token: token
            });
          }   
    
        }
    
      });
    });
    
    /****************************
      MIDDLEWARE (TO CHECK TOKEN)
    *****************************/
    
    apiRouter.use(function(req, res, next){
        
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        
        //if token exists
        if (token){
            jwt.verify(token, config.superSecret, function(err, decoded){
                if (err){
                    return res.send({success: false, message: "Failed to authenticate token."});
                } else {
                    //if everything else is good and token is authenticated
                    req.decoded = decoded;
                    next(); //passes the middleware check, can continue
                }
            });
        } else {
            //if there is no token
            //returns error status code 403: access forbidden and an error
            res.status(403).send({success: false, message: "No token provided."});
        }
        
    });
    
    apiRouter.get('/me', function(req, res){
        res.send(req.decoded);
    });
    
    /********************
      ROUTES => '/users'
    ********************/
    apiRouter.route('/users')
        .post(function(req, res){
            //create new instance in the db of a user
            var user = new User();
            
            //sets new user's from the request body
            user.name = req.body.name;
            user.username = req.body.username;
            user.password = req.body.password;
            
            //save the user and check for errors
            user.save(function(err){
                if (err){
                    if (err.code == 11000){
                        return res.json({success: false, message: 'A user with that username exists already.'});
                    } else {
                        return res.send(err);
                    }
                }
                //if no errors found
                res.json({message: 'User was created successfully!'});
            });
        })
        
        .get(function(req, res){
            
            User.find(function(err, users){
                if (err) { return res.send(err); }
                
                //return the users
                res.json(users)
            });
            
        });
        
    /************************
      ROUTES => '/users/:id'
    ************************/
    apiRouter.route('/users/:id')
        .get(function(req, res){
            User.findById(req.params.id, function(err, user){
                if  (err) return res.send(err);
                
                res.json(user);
            });
        })
        
        //updates a user's information
        .put(function(req, res){
            
            User.findById(req.params.id, function(err, user){
                if (err) return res.send(err);
                
                //replaces the contents if they are entered
                if (req.body.name) user.name = req.body.name;
                if (req.body.username) user.username = req.body.username;
                if (req.body.password) user.password = req.body.password;
                
                //saves the updates
                user.save(function(err){
                    if (err) return res.send(err)
                    
                    //success message
                    res.send({message: "User successfully updated!"});
                });
                
            });
            
        })
        
        //deletes a user from db
        .delete(function(req, res){
            
            User.remove({_id: req.params.id}, function(err, user){
                if (err) res.send(err);
                
                res.json({message: "User successfully deleted!"});
            }); 
        });
    
    
    //returning apiRouter to be used in server.js
    return apiRouter;
    
    
}; //end of module.export