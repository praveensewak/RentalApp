var mongoose = require('mongoose'),
    TripLocation = mongoose.model('TripLocation');


var repository=(function(){

	var _AddNew = function(data,callback){

		var tripdoc = new TripLocation(data);
		tripdoc.save(function(err,affectedRows,rawRes){
			if(!err){
				callback(err,affectedRows,rawRes);
			}else{
				console.log(err);
			}

		});
	}
	var _GetRecentTripLocation = function(data,callback){
		TripLocation.find(data).sort({datetime:"-1"}).exec(function(err,data){
			if(data.length>0){
				data = data[0];
			}else{
				data = null;
			}
			callback(err,data);
		});
	}


	return {
		AddNew:_AddNew,
		GetRecentTripLocation:_GetRecentTripLocation
	}
})();
module.exports=repository;