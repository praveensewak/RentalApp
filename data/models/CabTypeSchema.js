/**
 * Created by Naveed on 6/24/2014.
 */



var mongoose=require('mongoose'),
    Schema=mongoose.Schema;


var CabTypeSchema=new Schema({
        name:String
    },
    {
        collection:'cabTypes'
    }

);

mongoose.model('CabType',CabTypeSchema);