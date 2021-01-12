const { Request, validator } = require("../models/Request");
const { User } = require("../models/User");

async function saveRequest(uid, body) {
    const user = await User.findOne({ uid });
    if (!user) {
        throw new Error("User with uid not found");
    }
    const name = user.first_name + " " + user.last_name;
    const { value, error } = validator({
        ...body,
        creator_uid: uid,
        creator_name: name,
        phone: user.phone,
        country_code: user.country_code
    });
    if (error) {
        throw new Error(error.details[0].message);
    }
    const request = new Request(value);
    const savedRequest = await request.save();
    return savedRequest;
}

async function getAllRequests() {
    return Request.find();
}

async function getRequestByBloodType(bloodType, page, limit) {
    if (!bloodType) {
        throw new Error("Blood Type cannot be empty");
    }
    return Request.find({
        blood_type: { $in: getCompatibleBloodTypes(bloodType) }
    })
        .limit(limit * 1)
        .skip((page - 1) * limit);
}

function getCompatibleBloodTypes(bloodType) {
    switch (bloodType) {
        case "AB+":
            return ["AB+"];
        case "AB-":
            return ["AB+", "AB-"];
        case "A+":
            return ["AB+", "A+"];
        case "A-":
            return ["AB+", "AB-", "A+", "A-"];
        case "B+":
            return ["AB+", "B+"];
        case "B-":
            return ["AB+", "AB-", "B+", "B-"];
        case "O+":
            return ["AB+", "A+", "B+", "O+"];
        case "O-":
            return ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"];
        default:
            return [""];
    }
}

async function getMyRequests(uid, page, limit) {
    if (!uid) {
        throw new Error("UID cannot be empty");
    }
    return Request.find({ creator_uid: uid })
        .limit(limit * 1)
        .skip((page - 1) * limit);
}

async function deleteRequest(reqId) {
    if (!reqId) {
        throw new Error("Request ID cannot be empty");
    }
    await Request.deleteOne({ _id: reqId });
}

module.exports = {
    saveRequest,
    getAllRequests,
    getRequestByBloodType,
    getMyRequests,
    deleteRequest
};
