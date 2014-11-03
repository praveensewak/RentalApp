/**
 * Created by naveed on 8/10/14.
 */

var mongoose=require('mongoose'),
    Schema=mongoose.Schema,
    ObjectId=mongoose.Schema.Types.ObjectId;

var CallRedirectSchema=new Schema({
        udid:String,
        tripid: String,
        useridFrom:String,
        CallFrom:String,
        useridTo:String,
        CallTo:String

    },
    //{ strict: false },
    {
        collection:'callredirects'
    }

);

mongoose.model('CallRedirect',CallRedirectSchema);

