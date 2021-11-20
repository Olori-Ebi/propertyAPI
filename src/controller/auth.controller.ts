import pool from "../database/db/db";
import express, { Request, Response, NextFunction } from "express";
import {
  comparePassword,
  generateToken,
  hashPassword,
} from "../helper/helperUtils";
import { ValidateLogin, ValidateRegister } from "../helper/validator";

export const AuthSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validate = await ValidateRegister.validateAsync(req.body);
    const hashedPassword = await hashPassword(validate.password);
    const data = {
      first_name: validate.first_name,
      last_name: validate.last_name,
      email: validate.email,
      password: hashedPassword,
      phoneNumber: validate.phoneNumber,
      address: validate.address,
    };
    // check if email exists
    const user = await pool.query("SELECT email FROM users WHERE email=$1", [
      validate.email,
    ]);
    if (user.rows.length === 0) {
      const signupUser = await pool.query(
        "INSERT INTO users (first_name, last_name, email, address, password, phoneNumber) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          validate.first_name,
          validate.last_name,
          validate.email,
          validate.address,
          hashedPassword,
          validate.phoneNumber,
        ]
      );
      return res.status(201).json({
        status: "success",
        data,
      });
    }
    return res.status(409).send({
      status: "error",
      error: "Existing user",
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

export const AuthSignIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validate = await ValidateLogin.validateAsync(req.body);
    const user = await pool.query("SELECT * FROM users WHERE email=$1", [
      validate.email,
    ]);
    if (user.rows.length === 0) {
      return res.status(400).send({
        status: "error",
        message: "Invalid credentials",
      });
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
    } = user.rows[0];
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
    const data = { token, ...user.rows[0] };
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
