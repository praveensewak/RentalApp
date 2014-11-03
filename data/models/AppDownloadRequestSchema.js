/**
 * Created by Asif on 9/12/2014.
 */

var mongoose=require('mongoose'),
    Schema=mongoose.Schema;


var AppDownloadRequestSchema=new Schema({
        first_name:String,
        last_name:String,
        email_address:String,
        state:String,
        city:String,
        affiliate:String,
        comments:String
    },
    {
        collection:'AppDownloadRequest'
    }
);

mongoose.model('AppDownloadRequest',AppDownloadRequestSchema);