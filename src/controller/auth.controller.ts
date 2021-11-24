import { Request, Response, NextFunction } from "express";
import {
  comparePassword,
  generateToken,
  hashPassword,
} from "../helper/helperUtils";
import { ValidateLogin, ValidateRegister } from "../helper/validator";
import { CREATED_CODE } from "../constants/statusCodes";
import userQueries from "../service/authService";
import Errors from "../helper/error";

export const AuthSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validate = await ValidateRegister.validateAsync(req.body);
    const hashedPassword = await hashPassword(validate.password);

    const values = [
      validate.first_name,
      validate.last_name,
      validate.email,
      hashedPassword,
      validate.phoneNumber,
      validate.address,
    ];

    const result: any = await userQueries.create(values);

    if (result.error) {
      res.status(result.error.status).json({
        status: result.error.status,
        error: result.error.message,
        db_Error: result.error.error,
      });
      return;
    }

    return res.status(CREATED_CODE).json({
      status: CREATED_CODE,
      message: "Account successfully created",
      data: req.body,
    });
  } catch (error: any) {
    if (error.isJoi) {
      return Errors.joiErrorResponse(res, error);
    }
    next(error);
  }
};

export const AuthSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validate = await ValidateLogin.validateAsync(req.body);
    const values = [validate.email];
    const result: any = await userQueries.login(values);

    if (result.error) {
      res.status(403).json({
        status: 403,
        error: result.error.message,
      });
      return;
    }
    if (!result.rows.length) {
      res.status(404).json({
        status: 404,
        error: "The user does not exist",
      });
      return;
    }
    const {
      id,
      first_name,
      last_name,
      email,
      address,
      phonenumber,
      isadmin,
      password,
    } = result.rows[0];
    if (!(await comparePassword(validate.password, password))) {
      return res.status(400).send({
        status: 400,
        error: "invalid credentials",
      });
    }
    const token = await generateToken({
      id,
      first_name,
      last_name,
      email,
      address,
      phonenumber,
      isadmin,
    });
    const data = { token, ...result.rows[0] };
    return res.status(200).json({
      status: "success",
      data,
    });
  } catch (error: any) {
    console.log(error);
    if (error.isJoi) {
      return res.status(400).send({
        status: "error",
        message: error.details[0].message,
      });
    }
    next(error);
  }
};
