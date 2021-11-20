import express, { Request, Response, NextFunction } from "express";
import pool from "../database/db/db";
import { ValidatePropertyAd } from "../helper/validator";
import cloudinary from "../utils/cloudinary";

export const propertyAd = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: owner } = await req.user;

    const validate = await ValidatePropertyAd.validateAsync(req.body);
    const result = await cloudinary.uploader.upload(req.file?.path);
    const data = {
      owner,
      status: validate.status,
      price: validate.price,
      state: validate.state,
      city: validate.city,
      address: validate.address,
      type: validate.type,
      image_url: result.url,
    };

    const postAdvert = await pool.query(
      "INSERT INTO property (owner, status, price, state, city, address, type, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        owner,
        validate.status,
        validate.price,
        validate.state,
        validate.city,
        validate.address,
        validate.type,
        result.url,
      ]
    );

    return res.status(201).json({
      status: "success",
      data,
    });
  } catch (error: any) {
    if (error.isJoi) {
      return res.status(400).send({
        status: "error",
        message: error.details[0].message,
      });
    }
    next(error);
  }
};

export const getAllPropertyAd = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.query.type) {
      const { type } = req.query;
      const result = await pool.query(
        `SELECT users.id as ownerID,status,type,state,city,property.address,price,created_on,image_url,email AS ownerEmail,phonenumber AS ownerNumber FROM users JOIN property ON users.id=owner WHERE type=$1`,
        [type]
      );
      return res.status(200).json({
        status: "success",
        data: result.rows,
      });
    }

    const result = await pool.query(
      `SELECT users.id as ownerID,status,type,state,city,property.address,price,created_on,image_url,email AS ownerEmail,phonenumber AS ownerNumber FROM users JOIN property ON users.id=owner`
    );
    return res.status(200).json({
      status: "success",
      data: result.rows,
    });
  } catch (error: any) {
    return res.status(500).send({
      status: "error",
      message: "internal server error",
    });
  }
};

export const viewSpecificAdvert = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT users.id as ownerID,status,type,state,city,property.address,price,created_on,image_url,email AS ownerEmail,phonenumber AS ownerNumber FROM users JOIN property ON users.id=owner WHERE property.id=$1`,
      [id]
    );
    if (!result.rows.length) {
      return res.status(400).send({
        status: "error",
        message: `ID of ${id} does not exist`,
      });
    }
    return res.status(200).json({
      status: "success",
      data: result.rows[0],
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "internal server error",
    });
  }
};

export const deletePropertyAd = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = await req.user;
    const { propertyid } = req.params;

    const getProperties = await pool.query(
      `DELETE FROM property WHERE id=$1 AND owner=$2`,
      [propertyid, id]
    );

    if (getProperties.rowCount === 1) {
      return res.status(200).send({
        status: "success",
        message: "Property Deleted",
      });
    }
    if (getProperties.rowCount === 0) {
      return res.status(400).send({
        status: "error",
        error: "Property not found. Property may have been removed",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "internal server error",
    });
  }
};

export const markPropertyAsSold = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = await req.user;
    console.log(id);

    const { propertyid } = req.params;
    const updateResult = await pool.query(
      `UPDATE property SET status=$1 WHERE owner=$2 AND id=$3`,
      ["sold", id, propertyid]
    );
    if (updateResult.rowCount === 1) {
      return res.status(200).send({
        status: "success",
        message: "Property Sold",
      });
    }
    return res.status(400).send({
      status: "error",
      error: `You have no property advert with ID ${propertyid}. Input a correct property ID and try again`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "internal server error",
    });
  }
};

export const updateAd = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = await req.user;
    console.log(id);

    const { propertyid } = req.params;
    let cloudRes;

    const properties = await pool.query(
      `SELECT * FROM property WHERE id=$1 AND owner=$2`,
      [propertyid, id]
    );
    if (!properties.rows.length) {
      return res.status(400).send({
        status: "error",
        error: `You have no property advert with ID ${propertyid}. Input a correct property ID and try again`,
      });
    }

    let { price, state, city, address, type, image_url } = properties.rows[0];
    if (req.file?.path) {
      cloudRes = await cloudinary.uploader.upload(req.file?.path);
    }

    const updateResult = await pool.query(
      `UPDATE property SET price=$1, state=$2, city=$3, address=$4, type=$5, image_url=$6 WHERE id=$7 AND owner=$8`,
      [
        req.body.price || price,
        req.body.state || state,
        req.body.city || city,
        req.body.address || address,
        req.body.type || type,
        cloudRes.url || image_url,
        propertyid,
        id,
      ]
    );

    if (updateResult.rowCount === 1) {
      return res.status(200).send({
        status: "success",
        message: "Property Updated",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "internal server error",
    });
  }
};
