var express                 = require('express');
var path                    = require('path');
var cookieParser            = require('cookie-parser');
const bodyParser            = require("body-parser");
const expressValidator      = require('express-validator');
const cors                  = require("cors");
var logger                  = require('morgan');


var csvTojson             = require('./routes/csvtojson');



var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//express validator
app.use(expressValidator({
    customValidators:{
      isValidEmail:function(value){
        if(!value) return false;
        var val = value.trim();
        var email_reg_exp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return email_reg_exp.test(val);
      },
      isValidMongoId:function(value){
        if(!value) return false;
        var regex = /^[0-9a-f]{24}$/;
        return regex.test(value);
      },
      isBooleanData:function(value){
        if(!value) return false;
        if(value==true || value=='true' || value==false || value=='false'){
          return true;
        }
        return false;
      }
    }
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,content-encoding,Content-Type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

app.use(cors());

app.use('/csv_json',csvTojson);


console.log('server started');

module.exports = app;
