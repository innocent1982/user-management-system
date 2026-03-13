const bcrypt = require("bcrypt");

const hashPassword = async(value)=>{
    try{
    const saltCount = 10;
    const hash = await bcrypt.hash(password, saltCount);
    console.log(hash)
    }catch(e){
        console.log(`Caught the following error when encrypting password: ${e}`)
    }
}

const password = "inno2006";
hashPassword(password);