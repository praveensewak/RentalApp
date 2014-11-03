/**
 * Created by Asif on 8/25/2014.
 */

var mongoose=require('mongoose'),
    Schema=mongoose.Schema,
    ObjectId=mongoose.Schema.Types.ObjectId;

var UserPaymentSchema=new Schema({
        cardholder_first_name:String,
        cardholder_last_name: String,
        card_number: {type:String,unique: true,required: true},
        expiry_date:String,
        cvv_number:String,
        zip_code:String,
        user_id: {type:String,ref:'User',required: true},
        type:String,
        card_use_type:String,
        is_default:Boolean
    },
    {
        collection:'UserPayment'
    }
);
mongoose.model('UserPayment',UserPaymentSchema);