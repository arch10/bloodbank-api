const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: {
        type: String,
        min: 1,
        required: true
    },
    last_name: {
        type: String,
        min: 1,
        required: true
    },
    gender: {
        type: String,
        min: 1,
        required: true
    },
    dob: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    blood_type: {
        type: String,
        min: 2,
        required: true
    },
    state: {
        type: String,
        min: 1,
        required: true
    },
    city: {
        type: String,
        min: 1,
        required: true
    },
    created_on: {
        type: Number,
        default: new Date().getTime()
    },
    uid: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    country_code: {
        type: String,
        required: true
    }
});

const validationSchema = Joi.object({
    first_name: Joi.string().min(1).required(),
    last_name: Joi.string().min(1).required(),
    gender: Joi.string().min(1).required(),
    dob: Joi.number().required(),
    weight: Joi.number().required(),
    blood_type: Joi.string().min(2).required(),
    state: Joi.string().min(1).required(),
    city: Joi.string().min(1).required(),
    phone: Joi.string().required(),
    country_code: Joi.string().required()
}).unknown();

function validator(data) {
    return validationSchema.validate(data);
}

module.exports.User = mongoose.model("User", userSchema);
module.exports.validator = validator;
