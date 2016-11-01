var express= require("express");
var app = express();
var dateFormat = require('dateformat');
var bodyParser = require("body-parser");
var utils = require("./lib/utils.js");

//our db model
var urlDB = require("./lib/schema.js");

app.disable('x-powered-by');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.locals.dateFormat = dateFormat; // this makes moment available as a variable in every EJS page
app.locals.fullDateFormat = "mmmm dS, yyyy";
//the function removes protocol(http or https) from the given string
app.locals.removeProtocol = utils.removeProtocol;

//our db schema
var urlModel = urlDB.urlModel;

app.get("/", function(request, response){	
	
	//retreive last few blogposts from the db			
	//show index page with last few db entries listed	
	urlModel.find({})
	.sort({'created': -1})
	.limit(30)
	.exec(function(error, data) {
		if(error){
			utils.handle500(error, response);			
		}else{
			data.host=request.headers.host+"/";
			response.render("index", {data: data});
		}
	});
});

app.get("/new/*", function(request, response){				
	var longUrl = request.originalUrl.substring(5);
	//check the provided url
	if(utils.isValidUri(longUrl)){		
		//create entry
		urlDB.createEntry(longUrl, request, response);		
	}else{
		//show error message
		response.json({error: "Wrong url format, make sure you have a valid protocol and real site."});	
	}		
});


app.post("/", function(request, response){	
	var longUrl=request.body.longUrl;		
	if(utils.isValidUri(longUrl)){				
		urlDB.createEntry(longUrl, request, response);			
	}else{		
		response.redirect("/");
	}		
});

app.get("/:shortUrl", function(request, response){
	var shortUrl = request.params.shortUrl;
	
	urlModel.findOneAndUpdate({
        shortUrl: shortUrl
    },{$inc: { clicks: 1 }}, function(error, doc) {
        if(error) utils.handle500(error, response);
        else if (doc) response.redirect(doc.longUrl);
        else response.json({"error": "This url is not on the database."});
    });
});

//404 error handler
app.use(function(request, response){	
	response.status(404);
	response.render("404");
});

//500 error handler
app.use(function(error, request, response, next){
	utils.handle500(error, response);
});

//if Process env port is not defined - set 5000 as a port
app.set("port", process.env.PORT||5000);

app.listen(app.get("port"), function(){
	console.log("Server started");
});