/**
 * Created by Naveed on 7/3/2014.
 * Schema : DriverRequest  {driverid, requestid, status}
 possible values are "Pending", "Accepted" "Rejected" "NoResponse"
 *
 *
 */





var mongoose=require('mongoose'),
    Schema=mongoose.Schema,
    ObjectId=mongoose.Schema.Types.ObjectId;

var DriverRequestSchema=new Schema({
        driverid: String,
        requestid: String,
        driver_request_status: {type:String,enum:['pending','accepted','rejected','noresponse']}
    },
    {
        collection:'driverrequests'
    }

);

mongoose.model('DriverRequest',DriverRequestSchema);