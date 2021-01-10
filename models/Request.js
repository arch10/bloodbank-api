const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;

const requestSchema = new Schema(
    {
        creator_name: {
            type: String,
            min: 1,
            required: true
        },
        creator_uid: {
            type: String,
            min: 1,
            required: true
        },
        creator_dp: {
            type: String,
            required: false
        },
        blood_type: {
            type: String,
            min: 2,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        country_code: {
            type: String,
            required: true
        },
        expiry: {
            type: Number,
            required: true
        },
        desc: {
            type: String,
            required: false
        },
        hospital: {
            type: String,
            required: false
        },
        city: {
            type: String,
            min: 1,
            required: true
        },
        state: {
            type: String,
            min: 1,
            required: true
        },
        created_on: {
            type: Number,
            default: new Date().getTime(),
            required: true
        },
        updated_on: {
            type: Number,
            default: new Date().getTime(),
            required: true
        }
    },
    {
        timestamps: {
            currentTime: () => new Date().getTime(),
            createdAt: "created_on",
            updatedAt: "updated_on"
        }
    }
);

const validationSchema = Joi.object({
    creator_name: Joi.string().min(1).required(),
    creator_uid: Joi.string().min(1).required(),
    creator_dp: Joi.string(),
    blood_type: Joi.string().min(2).required(),
    state: Joi.string().min(1).required(),
    city: Joi.string().min(1).required(),
    phone: Joi.string().required(),
    country_code: Joi.string().required(),
    expiry: Joi.number().required(),
    desc: Joi.string().max(300),
    hospital: Joi.string()
}).options({ stripUnknown: true });

function validator(data) {
    return validationSchema.validate(data);
}

module.exports.Request = mongoose.model("Request", requestSchema);
module.exports.validator = validator;
