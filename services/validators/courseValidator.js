const {checkSchema} = require("express-validator");

exports.baseCourseValidator = checkSchema({
    name:{
        isLength:{
            options:{max:50},
            errorMessage:"Course name length requirements not met",
            bail:true 
        },
        custom:(value) => {
            const noSpcicalCharacter = /^[a-zA-Z0-9]+$/.test(value);
            const hasDigit = /[0-9]/.test(value);
            let valid = true;
            if(!noSpcicalCharacter){
                valid = false;
            }
            if(hasDigit){
                valid = false;
            }
            return valid;
        }
    },
    description:{
        isLength:{
            options:{max:500},
            errorMessage:"Course description length requirements not met",
            bail:true 
        }
    },
    level:{
        isInt:{
            options:{min:1},
            errorMessage:"Course level must be either beginner, intermediate or advanced"
        }
    }
})