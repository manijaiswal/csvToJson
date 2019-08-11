var express = require('express');
var formidable = require("formidable");
var path = require("path");
var fs = require("fs");
const csv=require('csvtojson');

var router = express.Router();

const uploadDir = path.join(__dirname, '../uploads/');


router.post('/convert_csv_to_json',(req,res)=>{
    if (!req.get('Content-Type').startsWith('multipart/form-data')) {
        // invalid type of data
        return res.status(500).json({
            "success":"false",
            "msg":"something went wrong"
        })
    }
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(500).json({
                "success":"false",
                "msg":"something went wrong"
            })
        }
        const fileName = uploadDir+files.file.name;
        csv()
        .fromFile(fileName)
        .then((jsonObj)=>{
            // console.log(jsonObj);
            res.status(200).json({
                "succces":"true",
                "data":jsonObj
            })
        })
    });
    // should be outside:
    form.on('fileBegin', function (name, file) {
        file.path = uploadDir + file.name;
    });
})

module.exports = router;
