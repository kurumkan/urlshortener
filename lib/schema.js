var mongoose = require("mongoose");
var utils = require("./utils.js");

//mongoose.connect("mongodb://localhost/urls");
//mongoose.connect("mongodb://kurumkan:fhnehbr1@ds139847.mlab.com:39847/urls");
mongoose.connect(process.env.MONGOLAB_URI);

//schema config
var urlSchema = new mongoose.Schema({
	shortUrl: String,
	longUrl: String,
	created: {
		type: Date, default: Date.now
	},
	clicks: {
		type: Number, default: 0
	}
});

module.exports = {
	//db model
	urlModel: mongoose.model("Url", urlSchema), 

	getValidShortUrl: function(cb) {		
		//get random string(to create short url)
	    var shortUrl = utils.getRandomString(6);    

	    //check if the string is already in the db
	    this.urlModel.findOne({
	        shortUrl: shortUrl
	    }, function(error, doc) {
	        if(error) 
	        	//error occured
	        	return cb(error);
	        else if (doc) 
	        	//this short url is already in the db.
	        	//try again
	        	return this.getValidShortUrl(cb);
	        else 
	        	//success
	        	cb(null, shortUrl);
	    });
	},
		
	//create document	
	createEntry: function(longUrl, request, response){		
		var _this = this;
		this.getValidShortUrl(function(error, shortUrl){				
		    if(error) {
		        utils.handle500(error, response);
		    } else {
		   		var newEntry={
					longUrl: longUrl, 
					shortUrl: shortUrl
				};							
				_this.urlModel.create(newEntry, function(error, data){
					if(error){			
						utils.handle500(error, response);
					}else{					
						if(request.method=="GET")
							//if the verb - get - respond in json format
							response.json({longUrl: longUrl, shortUrl: shortUrl});	
						else
							//redirect to the main page
							response.redirect("/");
					}
				});			     
		    }
		});
	}
}


