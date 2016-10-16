var http = require('http');
var zlib = require('zlib');
var domain = require('domain');

function start(){
	const server = http.createServer(function(request,response){
		var body = [] ;
		console.log(request.method);
		console.log(request.headers);
		request.on('data',function(chunk){
			if(chunk){
				body.push(chunk);
			}
		});

		request.on('end',function(){
			if(!body || body.length<0){
				console.log(`request body is null`);
			}
			body = Buffer.concat(body);
			console.log(`receive request data:${body.toString()}`);	
			response.writeHead(200,{'Content-Type':'text-plain'});
			response.end(new Buffer('response from server','binary'),function(){
				console.log(`response success`);
			});
		});


	}).listen(8090);

	server.on('clientError',(err,socket)=>{
		socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
	});
}

function startCheckGzip(){
	http.createServer(function(request,response){
		var i = 1024,data = '';
		while(i--){
			data +=',';
		}
		if((request.headers['accept-encoding']||'').indexOf('gzip')!==-1){
			//检测客户端是否支持gzip压缩
			zlib.gzip(data,function(err,data){
				response.writeHead(200,{
					'Content-Type':'text-plain',
					'Content-Encoding':'gzip',
				});
				response.end(data);
			});
		}else{
			response.writeHead(200,{
				'Content-Type':'text-plain',
			});
			response.end(data);
		}
	}).listen(8080);
}

function startLowPort(){
	http.createServer(function(request,response){
		response.writeHead(200,{
				'Content-Type':'text-plain',
			});
			response.end(data);
	}).listen(80,function(){
		var env = process.env,
			uid = parseInt(env['SUDO_UID'] || process.getuid(),10),
			gid = parseInt(env['SUDO_GID'] || process.getgid(),10);
		console.log('uid:'+uid+'\ngid:'+gid);
	});
}

function startDomainHttpClient(){

	function async(request,callback){
		callback('response from domain http client');
	}

	http.createServer(function(request,response){
		var d = domain.create();

		d.on('error',function(){
			response.writeHead(500);
			response.end();
		});

		d.run(function(){
			async(request,function(data){
				response.writeHead(200);
				response.end(data);
			});
		})
	})
}

startLowPort();