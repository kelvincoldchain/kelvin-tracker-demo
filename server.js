
var express = require('express');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var mongoose = require('mongoose');
var request = require("request")
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();  // create  a variable app so we can use express
var server = app.listen(3000);
var io = require('socket.io').listen(server);
app.locals.metaTag = "";
app.locals.metaDescription = "";
app.locals.metaTitle = "Download any book";
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
var Trip = require('./models/trip');
var Notify = require('./models/notify');
app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect('mongodb://localhost:27017/kelvin');
app.set('view engine','ejs'); // set the template engine
Trip.find({status : 1},function(err, a) {
						   app.locals.trip = JSON.stringify(a);
			});
function check(){
  	var request = require('request'),
						username = "kelvinvts",
						password = "trackit",
						url = "http://blazer7.geotrackers.co.in/GTWS/gtWs/LocationWs/getUsrLatestLocation",
						auth = "Basic " + new Buffer(username + ":" + password).toString("base64");

				request(
					{
						url : url,
						headers : {
							"Authorization" : auth
						}
					},
					function (error, re, body) {
						
						body = JSON.parse(body);
						var data = [];
						var j=0;
					 for(var i in body){
						    body[i].forEach(function(d){
								d.id = j;
								var t = d.analogData.split(":");
								JSON.parse(app.locals.trip).forEach(function(e){
										if(d.regNo==e.vehicle){
											//console.log(e.low+'----'+e.high);
											if(e.low<=t[1]<=e.high){
													Notify.findOneAndUpdate(
												    {vehicle:d.regNo  },
												    {$push: {data: d}},
												    {safe: true, upsert: true},
												    function(err, model) {
												        
												    });
													
												
												 d.m = 1;
												 data.push(d);
											}else{
												d.m = 0;
												 data.push(d);
											}
										}
								});
								j++;
						 
					 });
					 }
					 Notify.find({},function(weed){
					 		io.emit('notification', weed);	
					 });
						//console.log(data);
					 io.emit('check', data);
					 	check()
				
				}
			)

}
check();



app.get('/',function(request,response){
					var request = require('request'),
						username = "kelvinvts",
						password = "trackit",
						url = "http://blazer7.geotrackers.co.in/GTWS/gtWs/LocationWs/getUsrLatestLocation",
						auth = "Basic " + new Buffer(username + ":" + password).toString("base64"),
						 url2 = "http://integration.novire.com/ws3/rest/controller/services/"+encodeURIComponent(JSON.stringify({method:'ref_CurrentStatusDataSendWF',username:'kelvin_int',password:'password1'}))+"/"+encodeURIComponent(JSON.stringify({vehicleNo:''}));
	 		
var body =[];
				request(
					{
						url : url,
						headers : {
							"Authorization" : auth
						}
					},
					function (error, res, weed) {
						
						data = JSON.parse(weed);
						for(var i in data){
							body.push(data[i]);
						}
						
						request({url:url2,
								 	  method: 'GET',
								 headers: {
							     'Content-Type': 'application/json'
							  }},function(err,res,weed){
							  		var data = JSON.parse(weed);

							  				data.outputlst.forEach(function(e){
							  					var temp1  = {};
							  					temp1.speed     =e.ref_velocity;
									 			temp1.analogData  = "Temperature:"+e.ref_tempT1+"°C";
									 			temp1.regNo = e.ref_vehicleNumber;
									 			var temp =[];
							  				 	temp.push(temp1);
							  				 
									 					body.push(temp);
									 			
									 			
							  				});
							  	
							  					console.log(body);
							  		response.render("index",{result:body});
							  			
								 			
								 });
													
					
					}
				);
				
	
}); // Use for routing index page

app.get('/notify',function(request,response){
	Notify.find({},function(err, weed){
		
					 		response.render("notification",{result:weed});	
					 });
				
}); // Use for routing index page

app.get('/notification/:queryId',function(request,response){
	var objId = request.params.queryId;
	Notify.find({"_id":objId},function(err, weed){
							
					response.render("track",{result:weed});	
					 		
					 });
				
}); // Use for routing index page


app.post('/add_trip',function(request,response){
	var trip = new Trip()
	trip.name = request.body.clientName;
	trip.vehicle   = request.body.vehicleNumber;
	trip.destination = request.body.to;
	trip.source = request.body.from;
	trip.low = request.body.low;
	trip.high = request.body.high;
	trip.status = 1;
	trip.save(function(err) {
    if (err)
       console.log(err);
         var notify = new Notify();
		 notify.vehicle = d.regNo;
		 notify.data = [];
		 notify.save(function(err){
					if (err)
      				console.log(err);
      	});

    response.render("add");
  });
	
})
app.get('/add',function(request,response){
	
	response.render("add");
})





console.log("Listening on port: 3000 " );
