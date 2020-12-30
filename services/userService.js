const { User, validator } = require("../models/User");

async function saveUser(uid, body) {
    const { value, error } = validator(body);
    if (error) {
        throw new Error(error.details[0].message);
    }
    const data = { uid: uid, ...value };
    const user = new User(data);
    const savedUser = await user.save();
    return savedUser;
}

async function getUser(uid) {
    if (!uid) {
        throw new Error("UID cannot be empty");
    }
    const userExist = await User.findOne({ uid });
    return userExist;
}

module.exports = {
    saveUser,
    getUser
};
