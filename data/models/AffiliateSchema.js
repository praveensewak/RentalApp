/**
 * Created by Naveed on 6/24/2014.
 */



var mongoose=require('mongoose'),
    Schema=mongoose.Schema;


var AffiliateSchema=new Schema({
        name:String,
        country:String,
        city:String,
        state:String,
        affiliate_logo:String,
        isactive:Boolean
    },
    {
        collection:'affiliates'
    }
);

mongoose.model('Affiliate',AffiliateSchema);

