/**
 * Created by Asif on 8/9/2014.
 */

var mongoose=require('mongoose'),
    Schema=mongoose.Schema;
ObjectId=mongoose.Schema.Types.ObjectId;


var VehicleModelSchema=new Schema({
        model_name:String,
        make_id:{type:ObjectId,ref:'VehicleModel'},
        isactive:Boolean
    },
    {
        collection:'vehiclemodels'
    }
);
mongoose.model('VehicleModel',VehicleModelSchema);

