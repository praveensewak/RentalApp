/**
 * Created by Asif on 8/9/2014.
 */

var mongoose=require('mongoose'),
    Schema=mongoose.Schema;


var VehicleMakeSchema=new Schema({
        make_name:String,
        isactive:Boolean
    },
    {
        collection:'vehiclemakes'
    }
);
mongoose.model('VehicleMake',VehicleMakeSchema);

