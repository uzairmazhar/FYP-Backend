const express = require('express');
const cors = require('cors');
const app = express();

//this is a list of all the origins(hostnames,port number,protocal) that our server side will entertain
const WhiteList = ['http://localhost:9000' , 'https://localhost:3443' , 'http://localhost:3000', 'https://bbcs-frontend.herokuapp.com']; 
var corOptionsDelegate = (req,callback) =>{
    var corsOption;
    console.log(req.header('Origin'));
    if(WhiteList.indexOf(req.header('Origin')) !== -1){
        corsOption = {origin : true};
    }
    else{
        corsOption = {origin : false};
    }
    callback(null , corsOption);
}

exports.cors = cors();
exports.corsWithOptions = cors(corOptionsDelegate);
