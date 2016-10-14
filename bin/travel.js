var fs = require('fs');
var path = require('path');

function _travelSync(dir,callback){

	fs.access(dir,'r',(err,fd)=>{
		if(err){
			if(err.code==='ENOENT'){
				console.log(`file not exist`);
			}else{
				console.log(`file can not read:${dir}`);
			}
			return;
		}
		fs.readdirSync(dir).forEach(function (file){
		var pathname = path.join(dir,file);
		if(fs.statSync(pathname).isDirectory()){
			_travelSync(pathname,callback);
		}else{
			callback(pathname);
		}
	});
	})
}

function _travel(dir,callback,finish){
	fs.access(dir,'r',(err,fd)=>{
		if(err){
			if(err.code==='ENOENT'){
				console.log(`file not exist`);
			}else{
				console.log(`file can not read:${dir}`);
			}
			return;
		}else{
			 fs.stat(dir,function(error,stats){
				if(error){
					console.log(`stat error:${err}`);
					return;
				}
				if(stats.isDirectory()){
					fs.readdir(dir,function(error,files){
						if(files){
							console.log(`files length:${files.length},name:${dir}`);
						}else{
							console.log(`files info is null`);
						}
						if(error){
							console.log(`readdir error:${error}`);
						}
						if(files){
							(function next(i){
								console.log(`repeat i:${i}`);
								if(i<files.length){
									var pathname = path.join(dir,files[i]);
									fs.stat(pathname,function(err,statsInfo){
										if(err){
											console.log(`next stat error:${err}`);
											callback(pathname);
											next(i+1);
										}
										if(statsInfo.isDirectory()){
											callback(pathname);
											_travel(pathname,callback,function(){
												next(i+1);
											});
										}else{
											console.log(`file is not directory`);
											callback(pathname);
											next(i+1);
										}
									});
								}else{
									finish && finish();
								}
							}(0));
						}
					});
				}else{
					console.log(`file is not dir,dir name:${dir}`);
					callback(dir);
				}
			});
		}
	});
}

exports.travelFunc = function(dir,callback,finish){
	_travel(dir,callback,finish);
} 
exports.travelSyncFunc = function(dir,callback){
	_travelSync(dir,callback);
}