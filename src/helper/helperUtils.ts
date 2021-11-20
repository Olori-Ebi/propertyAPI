import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";

dotenv.config();
const secretKey = process.env.MY_SECRET;
/**
 * @class HelperUtils
 * @description
 * @exports HelperUtils
 */

export const generateToken = async (payload: { [key: string]: any }) => {
  const token = jwt.sign(payload, secretKey!);
  return token;
};

export const verifyToken = async (
  token: string
): Promise<string | JwtPayload | boolean> => {
  try {
    const payload = jwt.verify(token, secretKey!);
    return payload;
  } catch (error) {
    return false;
  }
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const comparePassword = async (
  password: string,
  hashPassword: string
): Promise<boolean> => {
  return bcrypt.compareSync(password, hashPassword);
};
