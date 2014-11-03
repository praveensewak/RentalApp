
var mongoose=require('mongoose'),
    Schema=mongoose.Schema,
    ObjectId=mongoose.Schema.Types.ObjectId;

var PassengerRequestSchema=new Schema({
       
       userid:{type:String, ref:'User'},
       ratting_type:String,
       who_rated:{type:String,ref:'User'},
       rattings:Number
    },
    {
        collection:'UserRatting'
    }

);


mongoose.model('UserRatting',PassengerRequestSchema);