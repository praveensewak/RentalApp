/**
 * Created by Asif on 8/10/2014.
 */
var mongo = require('mongodb');
var UserObject = mongo.BSONPure;

var mongoose=require('mongoose'),
    Schema=mongoose.Schema;


var PassengerDetailSchema=new Schema({
        city:String,
        state:String,
        tip:Number,
        isactive:Boolean,
        is_cash_enabled:Boolean,
        is_cash_default:Boolean,
        favourite_affiliate:{type:String,ref:'Affiliate'},
        user_image:String,
        user_id:{type:String,ref:'User',unique: true,required: true}
    },
    {
        collection:'PassengerDetail'
    }
);

mongoose.model('PassengerDetail',PassengerDetailSchema);

