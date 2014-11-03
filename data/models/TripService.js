var mongoose = require('mongoose'),
    Trip = mongoose.model('trip');


var repository=(function(){
	function _AddNew(data,callback){
		var tripdoc = new Trip(data);
		tripdoc.save(function(err,affectedRows,rawRes){
			if(!err){
				callback(err,affectedRows,rawRes);
			}else{
				console.log(err);
			}

		});
	} 

	function _GetOneByCriteria(jsonCriteria,callback){
		Trip.findOne(jsonCriteria,callback);
	}

	function _GetByCriteria(jsonCriteria,callback){

		Trip.find(jsonCriteria,callback);
	}

    function _GetByCriteriaLean(jsonCriteria,callback){

        var query =    Trip.find(jsonCriteria);
        query.lean();
        query.exec(callback);
    }


	function _Edit(jsonCriteria,data,callback){
		var tripdoc = new Trip(data);
		Trip.findOne(jsonCriteria,function(err,doc){
			if(doc){
				tripdoc.save(function(updateErr,affectedRows){
					_GetOneByCriteria(jsonCriteria,callback);
				});
			}
		});
	}
	function _UpdateLocation(jsonCriteria,data,callback){
		Trip.update(jsonCriteria,{$push:data},callback);
	}

	return {
		AddNew:_AddNew,
		GetByCriteria:_GetByCriteria,
        GetByCriteriaLean:_GetByCriteriaLean,
		GetOneByCriteria:_GetOneByCriteria,
		Edit:_Edit,
		UpdateLocation:_UpdateLocation
	}

})();
module.exports=repository;