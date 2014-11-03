/**
 * Created by Naveed on 6/24/2014.
 */



var mongoose=require('mongoose'),
    Schema=mongoose.Schema,
    ObjectId=mongoose.Schema.Types.ObjectId;

var point={type:Number, index:'2d'}

var CabSchema=new Schema({
    name:String,
    "type": {type:String,enum:['Cab','Lari']},
    affiliateid:{type:String,ref:'Affiliate'},
    ownerid:{type:String,ref:'Owner'},
    driverid:{type:String,ref:'Driver'},
    statusid:{type:String,ref:'Status'},
    position:{type:[Number], index:'2d'},
    isactive:Boolean,
    duration:Number,
    user_id:{type:String,ref:'User'},
    make_id:{type:String,ref:'VehicleMake'},
    model_id:{type:String,ref:'VehicleModel'},
    year:Number,
    interior_color:String,
    exterior_color:String,
    license_plate:String,
    medallion_number:String,
    is_default:String
},
    {
    collection:'cabs'
    }

);

mongoose.model('Cab',CabSchema);

