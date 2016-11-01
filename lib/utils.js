//valid url pattern
var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
var regex = new RegExp(expression);

//array of alphanumerical characters
var charArray = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

module.exports = {
	//validate url		
	isValidUri:function(string){
		return string.match(regex)!==null;
	},
	//generate random string
	getRandomString:function(size){
		var s="";
		for(var i=0; i<size; i++){
			var index = Math.floor(Math.random()*charArray.length);
			s+= charArray[index];
		}
		return s;
	},

	//remove protocol(http or https) from the given string
	removeProtocol:function(url){	
		return url.replace(/^https?\:\/\//i, "");
	},
	
	//handle internal errors
	handle500: function(error,response){
		console.log(error.stack);
		response.status(500);
		response.render("500");
	}
}