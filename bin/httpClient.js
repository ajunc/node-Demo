var http = require('http');

exports.start = function(){
	http.createServer(function(request,response){
		response.writeHead(200,{'Content-Type':'text-plain'});
		response.end('Hello World!');
	}).listen(8090);
}
