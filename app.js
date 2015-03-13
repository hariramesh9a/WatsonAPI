
/**
 * Module dependencies.
 */



var express = require('express'),
 Twitter=require('twitter'),
 http = require('http'),
https = require('https')
, path = require('path'),
fs= require('fs');
var app = express();

var mongoose = require( 'mongoose' );
mongoose.connect('mongodb://testdb:akbank05@ds055200.mongolab.com:55200/IbmCloud_g02qoi8i_2q4i4pj1');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
console.log('connect');
});

var PRODUCT_CHARACTERISTICSSchema = new mongoose.Schema({
	name:{ type: String },
	   inMarketSince:{ type: String },
	   satisfied: Number,
	   disSatisfied:Number,
	   battery: {
	       positive:Number,
	       negative:Number,
	       neutral:Number
	    },
	   size: {
	       positive:Number,
	       negative:Number,
	       neutral:Number
	    },
	   notifications: {
	       positive:Number,
	       negative:Number,
	       neutral:Number
	    },
	   price: {
	       positive:Number,
	       negative:Number,
	       neutral:Number
	    },
	   worth: {
	       positive:Number,
	       negative:Number,
	       neutral:Number
	    },
	   fitness: {
	      positive:Number,
	       negative:Number,
	       neutral:Number
	    },
	   comfort: {
	     positive:Number,
	       negative:Number,
	       neutral:Number
	    },
	   connectivity: {
	         positive:Number,
	       negative:Number,
	       neutral:Number
	    },
	   style: {
	     positive:Number,
	       negative:Number,
	       neutral:Number
	    }
 	});


var PRODUCT_CHARACTERISTIC= mongoose.model('PRODUCT_CHARACTERISTICS', PRODUCT_CHARACTERISTICSSchema);

// all environments

app.get('/chart',function ( req, res, next ){ res.render('index');
});

var client = new Twitter({
	consumer_key:  '0RXBNk4Kc4LGZRxxR9Q9sHho6',
	consumer_secret:'RUhaXs14zBcgQiZUqabwsftP3lMPetIVk7U91AqRKLoNhd3fja',
	access_token_key:'3082829207-HwpPY0hMYej21huArtrluY5ehNbuJkAw0f60iRs',
	access_token_secret:'H9SptiWXiKq6vbDhWLRO7Jh3ouZId4Y3cuZpn7O9WIgI1'
});
 
//There are many useful environment variables available in process.env.
//VCAP_APPLICATION contains useful information about a deployed application.
var appInfo = JSON.parse(process.env.VCAP_APPLICATION || "{}");
//TODO: Get application information and use it in your app.

//VCAP_SERVICES contains all the credentials of services bound to
//this application. For details of its content, please refer to
//the document or sample of each service.
var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
//TODO: Get service credentials and communicate with bluemix services.

//The IP address of the Cloud Foundry DEA (Droplet Execution Agent) that hosts this application:
var host = (process.env.VCAP_APP_HOST || 'localhost');
//The port on the DEA for communication with the application:
var port = (process.env.VCAP_APP_PORT || 3000);
//Start server



var server=http.createServer(function(req,res){
	fs.readFile('./index.html',function(error,data){
		res.writeHead(200,{'Content-Type':'text/html'});
		res.end(data,'utf-8');
	});
}).listen(port,host);
console.log('Server running');
console.log('App started on port ' + port);
var io=require('socket.io').listen(server);

var pdts='apple watch';
var i=0;
client.stream('statuses/filter', {track:pdts ,language:"en", filter_level:"low" }, function(stream) {
	  stream.on('data', function(tweet) {
		  //caling api
	
			i++;	 
		//  http.get("http://review-analysis-api.mybluemix.net/rest/review/process?productName=apple&reviewText=nice battery life",  
		//		  function(res) {
		//  console.log("Got response: " + res);
		//	}).on('error', function(e) {
		//	  console.log("Got error: " + e.message);
		//	});
		     
		
		  //wof callinf api
		 //dispalying results
		  
		 // var thor = new PRODUCT_CHARACTERISTIC({
			//  name:'Hari'
			//});
		//thor.save(function(err, thor) {
			//if (err) return console.error(err);
			//  console.dir(thor);
			  
			//  });  		
		  var apples;
		  var eventship;
		  PRODUCT_CHARACTERISTIC.find(function(err, eventss) {
				if (err) {return console.error(err);}
				console.log(i);
				if(i%100===1)
				{io.sockets.emit('tweet',{'user':tweet.user.screen_name,'text':tweet.text,'dat':eventss});}
				
				
				
				    });
		  
		 // console.log('tweet is '+eventship);
		 // apples=['Apple',eventss[0].satsified,eventss[0].disSatisfied];
		  //eof dispaly results
		  
		  
		  
		  console.log(tweet.text);
		  });
	  stream.on('error', function(error) {
	    throw error;
	  });
	});
