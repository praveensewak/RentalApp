/**
 * Created by Asif on 7/30/2014.
 */
var mongoose=require('mongoose'),
    Schema=mongoose.Schema,
    ObjectId=mongoose.Schema.Types.ObjectId;

var UserSchema=new Schema({
        email:{type:String, unique: true,required: true,index:1},
        phone_number:String,
        first_name: String,
        last_name: String,
        passwordHash:String,
        salt:String,
        user_type:{type:String,enum:['passenger','driver','admin','super_admin']},
        registration_code:Number,
        registration_status:{type:String,enum:['pending','verified','complete','registered']},
        registration_token:String,
        reset_password_expires:Date,
        reset_password_token:String,
        registration_date:{type:Date,default:Date.now},
        force_registration:String,
        device_id:String,
        ratting:Number,
        number_of_trips:Number,
        cabid:{type:ObjectId,ref:'Cab'}
        
    },
    {
        collection:'User'
    }
);

mongoose.model('User',UserSchema);