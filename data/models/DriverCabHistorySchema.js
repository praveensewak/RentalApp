/**
 * Created by Asif on 9/5/2014.
 */

var mongoose=require('mongoose'),
    Schema=mongoose.Schema;


var DriverCabHistorySchema=new Schema({
        cab_medallion_number:String,
        cab_affiliate_id:String,
        user_id:String,
        date_added:{type:Date,default:Date.now}
    },
    {
        collection:'DriverCabHistory'
    }
);

mongoose.model('DriverCabHistory',DriverCabHistorySchema);