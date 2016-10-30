var express = require("express");
var app = express();

app.get("/", function(request, response){	
	
	var ip = request.headers['x-forwarded-for'] || 
		     request.connection.remoteAddress || 
		     request.socket.remoteAddress ||
		     request.connection.socket.remoteAddress;

	var language = request.headers["accept-language"].split(",")[0];	
	var software = request.headers['user-agent'].match(/\(([^)]+)\)/)[1];
	
	response.json({
		ipaddress: ip, 
		language: language, 
		software: software
	});	
});

//if Process env port is not defined - set 5000 as a port
app.set("port", process.env.PORT||5000);

app.listen(app.get("port"), function(){
	console.log("Server started");
})