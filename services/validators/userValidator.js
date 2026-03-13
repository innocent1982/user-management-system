const { checkSchema } = require("express-validator");
const { password } = require("pg/lib/defaults");

exports.userValidator = checkSchema({
  username: {
    isLength: {
      options: { min: 6, max: 20 },
      errorMessage: "Username length conditions unmet",
      bail: true,
    },
    custom: {
      options: (value) => {
        let valid = true;
        const hasDigit = /[0-9]/.test(value);
        const noSpecialCharacter = /^[a-zA-Z0-9]/.test(value);
        if (hasDigit) {
          valid = false;
        }
        if(!noSpecialCharacter){
          valid = false;
        }
        return valid;
      },
    },
  },
  password: {
    isLength: {
      options: { min: 8, max: 20 },
      errorMessage: "Please provide a valid password length",
      bail: true,
    },
    custom: {
      options: (value) => {
       
        let valid = false;
        const hasDigit = /[0-9]/.test(value);
        const noSpecialCharacter = /^[a-zA-Z0-9]/.test(value);
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        if (hasDigit && hasLowerCase && !noSpecialCharacter && hasUpperCase) {
          valid = true;
        }
        return valid;
      },
    },
  },
  email: {
    isEmail: true,
    errorMessage: "email invalid",
  },
});

exports.emailInputValidator = checkSchema({
  username: {
    isLength: {
      options: { min: 6, max: 20 },
      errorMessage: "Username length conditions unmet",
      bail: true,
    },
    custom: {
      options: (value) => {
        let valid = true;
        const hasDigit = /[0-9]/.test(value);
        const noSpecialCharacter = /^[a-zA-Z0-9]/.test(value);
        if (hasDigit) {
          valid = false;
        }
        if(!noSpecialCharacter){
          valid = false;
        }
        return valid;
      },
    },
  },
    email: {
    isEmail: true,
    errorMessage: "email invalid",
  }

})
