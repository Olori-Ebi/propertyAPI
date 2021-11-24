import { BAD_REQUEST_CODE } from "../constants/statusCodes";
import { Response } from "express";

/* Handles controller errors
 *
 * @class Errors
 */
class Errors {
  /*
   * @static
   * @param {*} res
   * @param {*} e
   * @returns {object} error
   * @memberof Errors
   */
  static joiErrorResponse(res: Response, e: { [key: string]: any }) {
    return res.status(BAD_REQUEST_CODE).json({
      status: BAD_REQUEST_CODE,
      error: e.details[0].message.replace(/[^a-zA-Z0-9 ]/g, ""),
    });
  }
}

export default Errors;
