const bcrypt = require("bcrypt");

exports.encrypt = async(value) => {
    const saltCount = 10;
    try{
        const hash = await bcrypt.hash(value, saltCount);
        return hash
    }
    catch(e){
        throw new Error("Met an exception while encrypting the given value")
    }
}