import bcrypt from "bcrypt";

export const encrypt = async (value) => {
    const saltCount = 10;
    const hash = await bcrypt.hash(value, saltCount);
    return hash;
};
