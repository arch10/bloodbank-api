const { User, validator } = require("../models/User");

async function saveUser(uid, body) {
    const { value, error } = validator(body);
    if (error) {
        throw new Error(error.details[0].message);
    }
    const data = { ...value, uid: uid };
    const user = new User(data);
    const savedUser = await user.save();
    return savedUser;
}

async function getUser(uid) {
    if (!uid) {
        throw new Error("UID cannot be empty");
    }
    const user = await User.findOne({ uid });
    return user;
}

module.exports = {
    saveUser,
    getUser
};
