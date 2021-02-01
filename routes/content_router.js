const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const Content = require('../models/content_model');
var authenticate = require('../authenticate');
const multer = require('multer');
const fs = require("fs");
var pixels = require('get-pixels')
var jimp = require('jimp');
const sharp=require('sharp');
const resizer = require('node-image-resizer');
const ipfsAPI = require('ipfs-api');
const { db } = require('../models/content_model');

const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif|txt|mp4|docx|pdf|mkv|xlsx|csv)$/)) {
        return cb(new Error('You can upload only these files!'), false);
    }
    cb(null, true);
};

var hash1;
    
const upload = multer({ storage: storage, fileFilter: imageFileFilter});

const contentRouter = express.Router();
contentRouter.use(bodyparser.json());

contentRouter.route('/')
.get(authenticate.verifyUser,(req,res,next)=>{
    Content.find({user : req.user._id}, (err, content)=>{
        if(err){
            return next(err);
        }
        if(!content){
            res.statusCode = 403;
            res.end("No Content found!!");
        }
    })
    .populate('user')
    .then((content) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(content);
    }, (err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,upload.single('imageFile'), (req,res,next)=>{
    var content
    let ipfsFile = fs.readFileSync('C:/Users/Uzair Mazhar/Desktop/BBCS-ipfs/public/images/'+req.file.originalname);
    ipfs.files.add(ipfsFile, function (err, file) {
        if (err) {
            console.log(err);
        }
        //console.log(file)
        hash1 = file[0].hash
        
        Content.findOne({ipfs_Hash: hash1})
        .then((hash)=>{
            if(hash){
                console.log(hash)
                console.log("1")
                console.log(hash.ipfs_Hash)
                res.statusCode = 200;
                res.json({"status":"Enter content is already registered against another user!"})
            }
            if(!hash){
                console.log(hash)
                console.log("2")
                req.body.user = req.user._id;
                content = new Content({
                    user: req.body.user,
                    content: req.file.originalname,
                    ipfs_Hash: hash1
                })
                content.save()
                .then((content)=>{
                    Content.findById(content._id)
                    .populate('user')
                    .then((content)=>{
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(content);
                    },(err)=>next(err))
                    .catch((err)=>next(err));
                })        
            }
        })
             
    })
})
module.exports = contentRouter;