import { checkSchema } from "express-validator";

const emailField = {
  email: {
    isEmail: true,
    errorMessage: "email invalid",
  }
}

const usernameField = {
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
        const noSpecialCharacter = /^[a-zA-Z0-9]+$/.test(value);
        if (hasDigit) {
          valid = false;
        }
        if(!noSpecialCharacter){
          valid = false;
        }
        return valid;
      }
    }
  }
}
    

const passwordField = {
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
        const noSpecialCharacter = /^[a-zA-Z0-9]+$/.test(value);
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        if (hasDigit && hasLowerCase && !noSpecialCharacter && hasUpperCase) {
          valid = true;
        }
        return valid;
      },
    },
  },
}

const loginFields = {
  ...emailField,
  ...passwordField
}

const signUpFields = {
  ...usernameField,
  ...emailField,
  ...passwordField
}

const userFields = {
  ...usernameField,
  ...emailField
}

export const loginUserValidator = checkSchema(loginFields);
export const signUpValidator = checkSchema(signUpFields);
export const userValidator = checkSchema(userFields);
