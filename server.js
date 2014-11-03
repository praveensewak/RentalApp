var http = require("http");
var express = require("express");
var flash = require('express-flash');
var app = express();
var fs = require('fs');
var mongoose=require('mongoose');

//var autoIncrement = require('mongoose-auto-increment');
var flash = require("connect-flash");
var port = process.env.PORT || 3001

// Setup the View Engine
//app.set("view engine", "vash");

GLOBAL.expireDuration = 15;
GLOBAL.contact_number = "813-513-9522";

// New opt

app.set('view engine', 'jade');
app.locals.pretty = true;
app.locals._      = require('underscore');
app.locals._.str  = require('underscore.string');
app.locals.moment = require('moment');
app.use(express.bodyParser());
app.use(express.cookieParser());
//app.use(express.session({ secret: 'super-duper-secret-secret' }));
app.use(express.methodOverride());
app.use(require('stylus').middleware({ src: __dirname + '/public' }));

// End new opt

// Opt into Services
app.use(express.urlencoded());
app.use(express.json());
//app.use(express.cookieParser());
app.use(express.session({ secret: "taxi_Web_App" }));
app.use(flash());

// set the public static resource folder
app.use(express.static(__dirname + "/public"));

app.configure('development', function(){
    app.use(express.errorHandler());
});

var data = require("./data");
//Bootstrap models
var models_path = __dirname +'/data/'+'/models';


var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);
var controllers = require("./controllers");
var connectionString = "mongodb://localhost:27017/taxi";

if(process.env.CUSTOMCONNSTR_taxi!=null)
    connectionString = process.env.CUSTOMCONNSTR_taxi;
mongoose.connect(connectionString);
//for server
//mongoose.connect(process.env.CUSTOMCONNSTR_taxi);
// for localhost
//mongoose.connect('mongodb://localhost:27017/taxi');

var db = mongoose.connection;
//autoIncrement.initialize(db);
db.on("error",function(){
    console.log("error");
})
db.once("open",function(){
    console.log("OPEN")
})

// use authentication
var auth = require("./auth");
auth.init(app);

// Map the routes
controllers.init(app);

var server = http.createServer(app);

server.listen(port);