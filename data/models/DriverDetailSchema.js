/**
 * Created by Asif on 7/30/2014.
 */
var mongoose=require('mongoose'),
    Schema=mongoose.Schema,
    ObjectId=mongoose.Schema.Types.ObjectId;

var DriverDetailsSchema=new Schema({
        chauffeur_license_no: String,
        chauffeur_expiration_date:Date,
        chauffeur_license_state:String,
        chauffeur_license_city:String,
        chauffeur_license_attachment:String,
        driver_license_no: String,
        driver_license_expiration_date:Date,
        driver_license_state:String,
        driver_license_city:String,
        driver_license_attachment:String,
        address1:String,
        address2:String,
        city:String,
        state: {type:String},
        zipcode:String,
        user_id:{type:String,ref:'User',unique: true,required: true},
        status: {type:String,enum:['online','offline','onjob']},
        cabid:{type:ObjectId,ref:'Cab'},
        taxi_company:String,
        social_security_number:String,
        date_of_birth:Date,
        user_image:String,
        driverid:{type:String,unique: true,required: true},
        cab_affiliate_id:String,
        cab_medallion_number:String,
        bank_name:String,
        bank_routing_number:String,
        bank_account_number:String,
        bank_phone_number:String,
        bank_contact_person:String,
        notes:String,

        position:{type:[Number], index:'2d'}
        
    },

    {
        collection:'DriverDetails'
    }
);

mongoose.model('DriverDetails',DriverDetailsSchema);