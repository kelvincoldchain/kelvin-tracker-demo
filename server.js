
var express = require('express');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var math = require('mathjs');
var request = require("request")
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();  // create  a variable app so we can use express

app.locals.metaTag = "";
app.locals.metaDescription = "";
app.locals.metaTitle = "Download any book";
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine','ejs'); // set the template engine

app.get('/',function(request,response){
	response.render("index");
}); // Use for routing index page

app.get('/search/:category/:page',function(request,response){

	var search =  request.params.category;
    var page_number = request.params.page;
	app.locals.query = search;
	var result = "";
	if(page_number != 0 && page_number != 1){
	 app.locals.prev = parseInt(page_number)-1;
	 app.locals.next = parseInt(page_number)+1;
     }else{
     app.locals.prev = parseInt(page_number);
	 app.locals.next = parseInt(page_number)+1;
	 }
	  var url = "http://it-ebooks-api.info/v1/search/"+search+"/page/"+page_number;
  
	  //console.log("Connecting to "+url);
	http.get(url, function(res) {
    var body = '';

    res.on('data', function(chunk) {
        body += chunk;
    });

    res.on('end', function() {
        var fbResponse = JSON.parse(body)
        if(fbResponse.Error==0 && fbResponse.Page){
			//console.log(fbResponse );
			response.render("search_result",{result:fbResponse.Books});
		}else{
			response.render("error");
		}
		
    });
}).on('error', function(e) {
      console.log("Got error: ", e);
});	

}); // Use for routing search result page


app.post('/post_search/',function(request,response){

	var search =  request.body.dash;
  
	app.locals.query = search;
	var result = "";
	  var url = "http://it-ebooks-api.info/v1/search/"+search;
	 // console.log("Connecting to "+url);
	http.get(url, function(res) {
    var body = '';

    res.on('data', function(chunk) {
        body += chunk;
    });

    res.on('end', function() {
        var fbResponse = JSON.parse(body)
        if(fbResponse.Error==0 && fbResponse.Page){
			//console.log(fbResponse );
			response.render("search_result",{result:fbResponse.Books});
		}else{
			response.render("error");
		}
		
    });
}).on('error', function(e) {
      console.log("Got error: ", e);
});	

}); // Use for routing search result page

app.get('/result/:category?',function(request,response){

	var search =  request.params.category;
  
	
	var result = "";
	  var url = "http://it-ebooks-api.info/v1/book/"+search;
	//  console.log("Connecting to "+url);
	http.get(url, function(res) {
    var body = '';

    res.on('data', function(chunk) {
        body += chunk;
    });

    res.on('end', function() {
        var fbResponse = JSON.parse(body)
			
			if(fbResponse.Error==0 && fbResponse.Page){
			response.render("result",{result:fbResponse});
			
		}
		
    });
}).on('error', function(e) {
      response.render("error");
});	


}); // Use for routing search result page


app.get('*',function(request,response){
	response.render("error");
}); // Use for routing 404 page

app.listen(3000);
console.log("Listening on port: 3000 " );
