import express, { Request, Response, NextFunction } from "express";
import {
  CREATED_CODE,
  FORBIDDEN_CODE,
  SUCCESS_CODE,
} from "../constants/statusCodes";
import pool from "../database/db/db";
import { ValidatePropertyAd } from "../helper/validator";
import propertyQueries from "../service/propertyService";
import cloudinary from "../utils/cloudinary";

export const propertyAd = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: owner } = await req.user;

    const validate = await ValidatePropertyAd.validateAsync(req.body);
    const image = await cloudinary.uploader.upload(req.file?.path);

    const values = [
      owner,
      validate.status,
      validate.price,
      validate.state,
      validate.city,
      validate.address,
      validate.type,
      image.url,
    ];

    const result: { [key: string]: any } = await propertyQueries.create(values);

    if (result.error) {
      return res.status(result.error.status).json({
        status: result.error.status,
        error: result.error.message,
      });
    }
    return res.status(CREATED_CODE).json({
      status: CREATED_CODE,
      message: "Property posted",
      data: result.rows[0],
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
      const result: any = await propertyQueries.getAll(type);
      if (result.error) {
        return res.status(result.error.status).json({
          status: result.error.status,
          error: result.error.message,
        });
      }
      return res.status(SUCCESS_CODE).json({
        status: SUCCESS_CODE,
        data: result.rows[0],
      });
    }

    const resp: any = await propertyQueries.getAll();

    if (resp.error) {
      return res.status(resp.error.status).json({
        status: resp.error.status,
        error: resp.error.message,
      });
    }

    return res.status(SUCCESS_CODE).json({
      status: SUCCESS_CODE,
      result: resp.rows,
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

export const viewSpecificAdvert = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const result: any = await propertyQueries.viewOne(id);
    if (result.error) {
      return res.status(result.error.status).json({
        status: result.error.status,
        error: result.error.message,
      });
    }
    if (!result.rows.length) {
      return res.status(FORBIDDEN_CODE).json({
        status: FORBIDDEN_CODE,
        message: "The ressource you are trying to view is unavailable",
      });
    }

    return res.status(SUCCESS_CODE).json({
      status: SUCCESS_CODE,
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

    const result: any = await propertyQueries.delete(id, propertyid);

    if (result.error) {
      return res.status(result.error.status).json({
        status: result.error.status,
        error: result.error.message,
      });
    }
    if (result.rowCount === 0) {
      return res.status(FORBIDDEN_CODE).json({
        status: FORBIDDEN_CODE,
        message: "The property you are trying to delete is unavailable",
      });
    }
    return res.status(SUCCESS_CODE).json({
      status: SUCCESS_CODE,
      message: "property removed",
    });
  } catch (error) {
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
    const { propertyid } = req.params;
    const result: any = await propertyQueries.sold(id, propertyid);
    if (result.error) {
      return res.status(result.error.status).json({
        status: result.error.status,
        error: result.error.message,
      });
    }
    if (result.rowCount === 0) {
      return res.status(FORBIDDEN_CODE).json({
        status: FORBIDDEN_CODE,
        message: "The property you are trying to update is unavailable",
      });
    }
    return res.status(SUCCESS_CODE).json({
      status: SUCCESS_CODE,
      message: "property updated",
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "internal server error",
    });
  }
};

export const updateAd = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = await req.user;

    const { propertyid } = req.params;
    let cloudRes;

    const checker: any = await propertyQueries.cursor(propertyid);
    if (!checker.rows.length) {
      return res.status(404).json({
        status: 404,
        error: "Property could not be found",
      });
    }

    if (checker.rows[0].owner === id) {
      let { price, state, city, address, type, image_url } = checker.rows[0];
      if (req.file?.path) {
        cloudRes = await cloudinary.uploader.upload(req.file?.path);
      }

      const values = [
        req.body.price || price,
        req.body.state || state,
        req.body.city || city,
        req.body.address || address,
        req.body.type || type,
        cloudRes.url || image_url,
        propertyid,
        id,
      ];

      const result: any = await propertyQueries.update(values);
      if (result.rowCount > 0) {
        return res.status(SUCCESS_CODE).json({
          status: SUCCESS_CODE,
          message: "Property edited",
        });
      }
      return res.status(404).json({
        status: 404,
        error: "Could not proceed, not found",
      });
    }
    return res.status(403).json({
      status: 403,
      error: "Only the owner of this resources can perform this action",
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "internal server error",
    });
  }
};
