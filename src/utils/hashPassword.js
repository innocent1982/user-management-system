const bcrypt = require("bcrypt");

exports.encrypt = async(value) => {
    const saltCount = 10;
    const hash = await bcrypt.hash(value, saltCount);
    return hash
}