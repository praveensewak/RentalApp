// database.js
(function (database) {

//var db = require("massive");

// db.connect("postgres://postgres@localhost/mydatabase", function(err, db){
//   db.myTable.each(function(thing){
//     console.log(thing);
//   });
// });

    //For server
   //  var connectionString = process.env.CUSTOMCONNSTR_taxi;
    //For local
    var connectionString = "mongodb://localhost:27017/taxi";

  if(process.env.CUSTOMCONNSTR_taxi!=null)
      connectionString = process.env.CUSTOMCONNSTR_taxi;

    var mongodb = require("mongodb");
  var mongoUrl = connectionString;

  var theDb = null;

  database.getDb = function (next) {
    if (!theDb) {
      // connect to the database
      mongodb.MongoClient.connect(mongoUrl, function (err, db) {
        if (err) {
          next(err, null);
        } else {
          theDb = {
            db: db,
              notes: db.collection("Note"),
              users: db.collection("User"),
              user_payment_details: db.collection("UserPayment"),
              driver_details: db.collection("DriverDetails")
          };
          next(null, theDb);
        }
      });
    } else {
      next(null, theDb);
    }
  }

})(module.exports);