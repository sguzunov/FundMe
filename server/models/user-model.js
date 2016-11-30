/* globals module, require */

'use strict';

const mongoose = require('mongoose');
const encryption = require('../utilities/encryption');
const fieldsValidator = require('./utils/validator');

const MinUsernameLength = 3;
const MaxUsernameLength = 20;

function hasRole(user, role) {
    return user.roles.indexOf(role) >= 0;
}

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(value) {
                return fieldsValidator.validateLength(value, MinUsernameLength, MaxUsernameLength);
            },
            message: '{VALUE} is not a valid username!'
        }
    },
    passHash: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        validate: {
            validator: function(value) {

                // http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
                // var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                // return re.test(value);
            },
            message: '{VALUE} is not a valid email!'
        }
    },
    salt: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        //TO DO - set dafault imageID
        default: ''
    },
    roles: [String],
    isDeleted: [Boolean],
    isBlocked: [Boolean]
});

userSchema.virtual('fullname').get(function() {
    let fullname = `${this.firstname} ${this.lastname}`;
    return fullname;
});

userSchema.virtual('isAdmin').get(function() {
    return this.roles.indexOf('Admin') >= 0;
});

userSchema.method({
    authenticate: function(password) {
        let inputHashedPassword = encryption.generateHashedPassword(this.salt, password);

        if (inputHashedPassword === this.passHash) {
            return true;
        }

        return false;
    }
});

userSchema.method({
    assignRole: function(role) {
        let roleToLower = role.toLowerCase();
        if (!hasRole(this, roleToLower)) {
            this.roles.push(roleToLower);
        }
    }
});

userSchema.method({
    removeRole: function(role) {
        let roleToLower = role.toLowerCase();
        if (hasRole(this, roleToLower)) {
            this.roles.splice(this.roles.indexOf(roleToLower), 1);
        }
    }
});

mongoose.model('User', userSchema);
module.exports = mongoose.model('User');