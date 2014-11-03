var mongoose=require('mongoose'),
	autoIncrement = require('mongoose-auto-increment'),
    Schema=mongoose.Schema,
    Mixed = Schema.Types.Mixed;
    ObjectId=mongoose.Schema.Types.ObjectId;
    autoIncrement.initialize(mongoose.connection);



var TripSchema=new Schema({

		tripid:String,

        requestid:String,

        passengerid:String,
        driverid:String,

        tripdatetime:{type:Date,default:Date.now},

        trip_driver_first_name:String,
        trip_driver_last_name:String,
        trip_driver_image_url:String,
        trip_driver_ratting:{type:Number,default:0},

        passenger_request_latitude:Number,
        passenger_request_longitude:Number,
        passenger_request_address:String,
        passenger_request_postal_code:String,
        passenger_request_country:String,
        passenger_request_city:String,
        passenger_request_state:String,
        passenger_request_datetime:Date,
        

        driver_accept_latitude:Number,
        driver_accept_longitude:Number,
        driver_accept_address:String,
        driver_accept_postal_code:String,
        driver_accept_city:String,
        driver_accept_country:String,
        driver_accept_state:String,
        driver_accept_datetime:Date,

        trip_driver_arrival_latitude:Number,
        trip_driver_arrival_longitude:Number,
        trip_driver_arrival_address:String,
        trip_driver_arrival_datetime:Date,
        
        trip_start_latitude:Number,
        trip_start_longitude:Number,
        trip_start_address:String,
        trip_start_datetime: Date,

        trip_end_latitude:Number,
        trip_end_longitude:Number,
        trip_end_address:String,
        trip_end_datetime:Date,

        trip_fare:Number,
        trip_tip:Number,
        trip_tip_percentage:Number,
        trip_grandtotal:Number,
        payment_mode:String,

        trip_positions:Mixed,

        affiliate_id:String,
        cab_medallion_no:String,
        total_duration:Number,
        total_miles : Number,

        trip_payment_choice:String,

        driver_phone_number:String,
        passenger_phone_number:String,

        trip_actual_distance:Number,
        trip_actual_duration:Number,
        trip_contact_number:String,

        trip_user_ratted:{type:Boolean,default:false},
        trip_status: {type:String,enum:['initiated','arrived','tripstarted','Completed','cancelled'],default:'initiated'}

    },
    {
        collection:'trip'
    }

);

TripSchema.plugin(autoIncrement.plugin,{model:'trip',field:'tripid'});

mongoose.model('trip',TripSchema);