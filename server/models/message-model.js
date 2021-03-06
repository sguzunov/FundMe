/* globals require module */

'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let messageSchema = new Schema({
    firstUser: {
        type: {},
        required: true
    },
    secondUser: {
        type: {},
        required: true
    },
    texts: {
        type: [{}]
    },
    identification:{
        type:String,
        required:true
    }
});

mongoose.model('Message', messageSchema);

module.exports = mongoose.model('Message');
