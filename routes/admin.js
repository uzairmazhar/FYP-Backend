const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const Content = require('../models/content_model');
const User = require('../models/user_model');

const adminRouter = express.Router();
adminRouter.use(bodyparser.json());

adminRouter.route('/content')
.get(authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    Content.find({}, (err, content)=>{
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
adminRouter.route('/users')
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    Content.find({}, (err, user)=>{
        if(err){
            return next(err);
        }
        if(!user){
            res.statusCode = 403;
            res.end("No User found!!");
        }
    })
    .then((user)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
    }, (err)=>next(err))
    .catch((err)=>next(err));
})
adminRouter.route('/user/:userId')
.get(authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    User.findById(req.params.userId, (err, user)=>{
        if(err){
            return next(err);
        }
        if(!user){
            res.statusCode = 403;
            res.end("No Content found!!");
        }
    })
    .then((user) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
    }, (err)=>next(err))
    .catch((err)=>next(err));
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    User.findByIdAndRemove(req.params.userId)
    .then((user)=>{
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
    },(err)=> {next();})
    .catch((err)=>{next();});
})
module.exports = adminRouter;