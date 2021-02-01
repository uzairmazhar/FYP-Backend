const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');
const fs = require("fs");
var pixels = require('get-pixels')
var jimp = require('jimp');
const sharp=require('sharp');
const resizer = require('node-image-resizer');
var imagedata;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const storage1 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/javascripts');
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter});
const upload1 = multer({ storage: storage1, fileFilter: imageFileFilter});

async function main() {
    let dir = 'Task 3.png'
    var images = ['C:/Users/Uzair Mazhar/Desktop/FYP Backend/BBCS/public/images/'+dir,'image1.png'];
    var jimps=[];
    for (var i=0;i<2;i++){
        jimps.push(jimp.read(images[i]));
    }
    Promise.all(jimps).then(function(data){
        return Promise.all(jimps);
    }).then(function(data){
        data[0].composite(data[1],0,0)
        data[0].write('final-image/'+dir,function(){
            console.log('Success');
        })
    })
}
    async function compareImages(image1Url, image2Url) {

        const image1 = await jimp.read(image1Url);
        const image2 = await jimp.read(image2Url);
        // Perceived distance
        const distance = jimp.distance(image1, image2);
        // Pixel difference
        const diff = jimp.diff(image1, image2);
        
        console.log(`compareImages: distance: ${distance.toFixed(3)}, diff.percent: ${diff.percent.toFixed(3)}`);
        if (distance < 0.0 || diff.percent < 0.0) {
            console.log("compareImages: Images match!");
            return true;
        } else {
            console.log("compareImages: Images do NOT match!");
            return false;
        }
    }
    // jimp.read(__basedir+'/public/javascripts/temp.png')
    //     .then((image)=>{
    //         return image
    //             .resize(256,256)
    //             .quality(80)
    //     }).catch((err)=>{
    //         console.log(err);
    // });
    // let inputFile = __basedir+'/public/javascripts/temp.png'
    // let outputFile = __basedir+'/public/javascripts/temp.png'
    // sharp(inputFile).resize({ height: 1560, width: 1600 }).toFile(outputFile)
    //     .then(function(newFileInfo) {
    //         console.log("Success");
    //     })
    //     .catch(function(err) {
    //         console.log("Error occured");
    //      });
    
    // const setup = { 
    //     all: {
    //       path: './thumbnails/',
    //       quality: 80
    //     },
    //     versions: [{
    //       prefix: 'big_',
    //       width: 1024,
    //       height: 768
    //     }, {
    //       prefix: 'medium_',
    //       width: 512,
    //       height: 256
    //     }, {
    //       quality: 100,
    //       prefix: 'small_',
    //       width: 128,
    //       height: 64
    //     }]
    //   };
    //   (async () => {
    //     thumbs = await resizer('C:/Users/Uzair Mazhar/Desktop/FYP Backend/BBCS/public/javascripts/Task 3.png', setup);    
    //   })();

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());
console.log(__basedir);
console.log(imagedata);
uploadRouter.route('/')
.post(upload.single('imageFile'), (req, res) => {
    // pixels("./public/images/" + req.file.originalname, function(err, pixels){
    //     if(err){
    //         console.log("Error was found")
    //     }
    //     console.log("Pixels values of the image are ", pixels.data);
    //     for(var i=0;i<pixels.data.length;i++){
    //         if(pixels.data[i]%2==0)
    //             pixels.data[i]=pixels.data[i]+1
    //         else
    //             pixels.data[i]=pixels.data[i]-1    
    //     }
    //     console.log("Pixels values after stegnography are ", pixels.data);
    //     imagedata = pixels.data;
    // })
    // imagedata = fs.readFileSync(
    //     __basedir + "/public/images/"+req.file.originalname
    // )
    // console.log(imagedata.length)
    // for(var i=imagedata.length;i>imagedata.length-5;i--){
    //     if(imagedata[i]%2==0)
    //         imagedata[i]=imagedata[i]+1
    //     else    
    //         imagedata[i]=imagedata[i]-1
    // }
    //console.log(imagedata);
    //const orgimage=Jimp.read(__basedir+'/public/images/'+req.file.originalname)
    //const mask = Jimp.read(__basedir+'/public/images/masking.png')
    //orgimage.mask(mask);

    // let maskImage = new ImageMask(__basedir+'/public/images/'+req.file.originalname);

    // maskImage.mask([
    //     [0, .95],           // start point
    //     [.8, .95, 1, .7],   // quadratic curve
    //     [1, 1],             // line
    //     [0, 1],             // line
    // ]);
    // fs.writeFileSync(
    //      __basedir + "/public/javascripts/"+req.file.originalname,
    //      maskImage
    //  );         
    // pixels("./public/images/Lab 11 Task 1.png" , function(err, pixels){
    //     if(err){
    //         console.log("Error was found")
    //     }
    //     console.log("Pixels values of the image are ", pixels.data);
    // })
    // pixels("./public/images/Lab 11 Task 1.png" , function(err, pixels){
    // if(err){
    //     console.log("Error was found")
    // }
    // console.log("Pixels values of the image are ", pixels.data);
    // })
    main()
    //compareImages('C:/Users/Uzair Mazhar/Desktop/FYP Backend/BBCS/public/images/Task 3.png','C:/Users/Uzair Mazhar/Desktop/FYP Backend/BBCS/final-image/Task 2.png');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})
module.exports = uploadRouter;