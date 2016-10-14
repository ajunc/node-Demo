var fs = require('fs');
var http = require('http');


//保存网络图片
var readCount=0;
http.get('http://cimg2.res.meizu.com/www/201605/1462760369902.jpg',function (res){
	res.setEncoding('binary');
	var imageData = '';
	res.on('data',function(data){
		console.log(`read http image count:${++readCount}`);
		imageData+=data;
	}).on('end',function(){
		fs.writeFile('lifeKit.jpg',imageData,'binary',function(error){
			if(error) throw error;
		});
	});
});


//保存本地图片：大文件使用.pipe方法进行处理
var rs = fs.createReadStream('meizu.jpg');
var ws = fs.createWriteStream('logo.jpg');

var num=0;
rs.on('data',function (chunk){
	console.log(`get data ${++num}`);
	//ws.write(chunk);
	//为了防止内存溢出,写入速度过慢导致读取到的数据被缓存在缓存区导致内存溢出
	if(ws.write(chunk)===false){
		rs.pause();
	}
});


rs.on('end',function(){
	ws.end();
	console.log(`read end`);
});

//监听只写数据流是否将缓存数据写入目标
ws.on('drain',function(){
	console.log(`write file drain`);
	rs.resume();
});

ws.on('end',function(){
	console.log(`write end`);
});