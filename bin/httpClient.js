var http = require('http');
var zlib = require('zlib');

function start(){
	http.createServer(function(request,response){
		var body = [];
		console.log(`request method:${request.method}`);
		console.log(`request body:${request.body}`);
		request.on('data',function(chunk){
			body.push(data);
		});

		request.on('end',function(){
			if(body && body.length>0){
				body = Buffer.connect(body);
				console.log(body.toString());
			}else{
				console.log(`request body is null`);
			}	
		});

		response.writeHead(200,{'Content-Type':'text-plain'});
		response.end('response from server');
	}).listen(8090);
}

function startClient(){
	var options = {
		hostname:'127.0.0.1',
		port:8090,
		path:'',
		method:'POST',
		headers:{
			'Content-Type':'application/x-www-form-urlencoded',
		}
	};
	var request = http.request(options,function(response){
		var body = [];

		console.log(response.statusCode);
		console.log(response.headers);

		response.on('data',function(chunk){
			if(chunk){
				body.push(chunk);
			}
		});

		response.on('end',function(){
			body = Buffer.concat(body);
			console.log(`receive response data:${body.toString()}`);
		});
	});

	request.write(new Buffer('Hello Http Client','binary'));
	request.end();
}

function startClientWithGzipCheck(){
	var options={
		hostname:'127.0.0.1',
		port:8080,
		path:'/',
		method:'GET',
		headers:{
			'Accept-Encoding':'gzip,defalte',
		}
	};
	http.request(options,function(response){
		var body = [];
		response.on('data',function(chunk){
			body.push(chunk);
		});

		response.on('end',function(){
			body = Buffer.conact(body);
			//检测服务器端是否支持gzip
			if(response.headers['content-encoding']==='gzip'){
				zlib.gunzip(body,function(err,data){
					if(err){
						console.log(`ungzip get error`)
						console.log(err);	
					}else{
						console.log(`get data:${data.toString()}`);
					}
				});
			}else{
				console.log(`get data:${data.toString()}`);
			}
		});
	}).end();
}

module.exports = {
	start,
	startClient,
	startClientWithGzipCheck,
}
