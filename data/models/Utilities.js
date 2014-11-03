//var baseUrl = "http://taxi.azurewebsites.net";
var ms = require('../../modules/message-settings');
var baseUrl = ms.url;

function FixURL(obj){
	for(var i in obj){
		if(typeof(obj[i])=='object'){
			obj[i] = FixURL(obj[i]);
		}
		else if(typeof(obj[i])=='string'){
			if(obj[i].indexOf('user_attachments')>-1){
					obj[i] = baseUrl+obj[i];
			}
		}
	}
	return obj;

}
module.exports.FixURL=FixURL;