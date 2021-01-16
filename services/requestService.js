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

async function getRequestByUser(uid, page, limit) {
    const currentTime = new Date().getTime();
    const user = await User.findOne({ uid });
    if (isValidUser(user)) {
        return Request.find({
            blood_type: { $in: getCompatibleBloodTypes(user.blood_type) },
            city: user.city,
            state: user.state,
            creator_uid: { $ne: uid },
            expiry: { $gt: currentTime }
        })
            .limit(limit * 1)
            .skip((page - 1) * limit);
    } else {
        return [];
    }
}

function isValidUser(user) {
    if (user.weight < 50 || !isAllowedAge(user.dob) || !user.donor) {
        return false;
    }
    return true;
}

function isAllowedAge(dob) {
    const currentTime = new Date().getTime();
    const diff = currentTime - dob;
    // 31449600000 is years in milliseconds
    const yrs = diff / 31449600000;
    return yrs > 18;
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
    getRequestByUser,
    getMyRequests,
    deleteRequest
};
