var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContentSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
    },
    ipfs_Hash:{
        type: String
    }
},{
    timestamps: true
})

var Content = mongoose.model('Content', ContentSchema);
module.exports = Content;
