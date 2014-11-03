/**
 * Created by naveed on 8/4/14.
 */


var mongoose=require('mongoose'),
    Schema=mongoose.Schema,
    ObjectId=mongoose.Schema.Types.ObjectId;


var LookupSchema=new Schema({
        passengerid:{type:String, unique: true,index:1},
        driverid: {type:String, unique: true,index:1}


    },
    {
        collection:'lookup'
    }

);



mongoose.model('Lookup',LookupSchema);

