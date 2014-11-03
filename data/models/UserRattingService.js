var mongoose = require('mongoose'),
    UserRatting = mongoose.model('UserRatting');

var repository=(function(){

	function _Add(data,callback){
		var ratting = new UserRatting(data);
		ratting.save(callback);
	}
	return {
		AddNew:_Add
	}

    })();
    module.exports=repository;