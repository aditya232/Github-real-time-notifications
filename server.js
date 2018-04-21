const {google} = require("googleapis");
const express = require("express");
const axios =require("axios") ;
const bodyParser = require('body-parser') ;
const serviceAccount = require("./serviceAccountKey.json");
const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);
const app = express();
const cacheMiddleware = require('./middleware/cache')(redis) ;
const authMiddleware = require('./middleware/auth');
var urlencodedParser = bodyParser.urlencoded({ extended: true }) ;

var port = process.env.PORT || 8000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

app.post("/credential",bodyParser.json(),authMiddleware,cacheMiddleware,async function(req, res) {
	try{
		var	response = await axios.get(`http://${req.headers.host}/token`)
		var obj = await axios.get('https://chrome-extension-90948.firebaseio.com/users.json',{
	    		params:{access_token: response.data,
	    			orderBy:'"/handle"',
	    			equalTo:`"${req.body.handle}"`
	  				}
	  			}) 
		 redis.set(req.body.handle,obj.data[req.body.handle]["token"]);
	  	 res.send(obj.data[req.body.handle]["token"]);
  	}
  	catch(err){
  		res.status(500).send({ error: err });
  		throw err ;
	}
});

app.post("/register",urlencodedParser,async function(req, res) {
	console.log(req.headers.authorization);
	try{
		var response = await axios.get(`http://${req.headers.host}/token`)
		var obj= await axios({method:'PATCH',
	  		url:`https://chrome-extension-90948.firebaseio.com/users/${req.body.handle}.json`,
	  		params: {
	    		access_token: response.data,
	  		},
	  		data: {
	  			handle:req.body.handle,
	    		token: req.body.token}
			}) 
	  		res.send('OK'); 
	  	}catch(err){
	  		res.status(500).send({ error: err });
  			throw err ;
	  	}
});

app.get("/token", function(req, res) {
	// Define the required scopes.
	var scopes = [
	  "https://www.googleapis.com/auth/userinfo.email",
	  "https://www.googleapis.com/auth/firebase.database"
	];
							
	// Authenticate a JWT client with the service account.
	var jwtClient = new google.auth.JWT(
	  serviceAccount.client_email,
	  null,
	  serviceAccount.private_key,
	  scopes
	);

	// Use the JWT client to generate an access token.
	jwtClient.authorize(function(error, tokens) {
	  if (error) {
	    console.log("Error making request to generate access token:", error);
	  } else if (tokens.access_token === null) {
	    console.log("Provided service account does not have permission to generate access tokens");
	  } else {
	    accessToken = tokens.access_token;
	    res.end(accessToken);
	  }
	}); 
});

app.post("/event",bodyParser.json(),async function(req,res){
	try{
		var response = await axios({method:'POST',
			url:'https://gcm-http.googleapis.com/gcm/send',
			headers: {'Authorization':process.env.SERVER_KEY,
			'Content-Type': 'application/json'
		},
			data:{
				"to":req.body.token,
				"data" : {
	  			"message" :req.body.message
	 			 }
			}
		})
		res.send('OK');
	}catch(err){
	  		res.status(500).send({ error: err });
  			throw err ;
	}
});


