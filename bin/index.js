var travel = require('./travel');
var httpClient = require('./httpClient');

var path = require('path');

var dir = path.normalize('//usr/include');

function start(type){
	if(type==='file'){
		console.log(`==============`);
		var count=0;
		travel.travelFunc(dir,function(pathname){
			console.log(`${++count}===${pathname}`);
		},function(){
			console.log('=======read finish');
		});
	}else if(type==='fileSync'){
		var synCount=0;
		travel.travelSyncFunc(dir,function(pathname){
			console.log(`${++synCount}`);
		});
	}else if(type==='http'){
		httpClient.start();
	}
}

start('http');

