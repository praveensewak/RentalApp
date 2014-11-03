var mongoose=require('mongoose'),
    Schema=mongoose.Schema;


var TripLocationSchema=new Schema({
        tripid:String,
        latitude:Number,
        longitude:Number,
        datetime:{type:Date,default:Date.now}
    },
    {
        collection:'triplocations'
    }
);

mongoose.model('TripLocation',TripLocationSchema);