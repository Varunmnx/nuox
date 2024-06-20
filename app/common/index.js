const RESPONSES = {
  BAD_REQUEST: 400,
  SERVER_ERROR: 501,
  NOT_FOUND: 404,
  SUCCESS: 201,
};

const ApiResponseStatus = {
  SUCCESS: "success",
  NOT_SUCCESS: "not success",
};

class APIResponseManager {
  constructor() {}

  /**
   * Sends a response with a status code indicating success and the provided data.
   *
   * @param {Object} res - The response object.
   * @param {any} data - The data to be included in the response.
   * @return {Object} The response object with the status code and data.
   */
  static success(res, data) {
    return res
      .status(RESPONSES.SUCCESS)
      .json({ status: ApiResponseStatus.SUCCESS, data: data });
  }

  /**
   * Sends a response with a status code indicating a failure and the provided data.
   *
   * @param {Object} res - The response object.
   * @param {any} data - The data to be included in the response.
   * @return {Object} The response object with the status code and data.
   */
  static notSuccess(res, data) {
    return res
      .status(RESPONSES.SERVER_ERROR)
      .json({ status: ApiResponseStatus.NOT_SUCCESS, data: data });
  }
  /**
   * Sends a response with a status code indicating a failure and the provided data.
   *
   * @param {Object} res - The response object.
   * @param {any} data - The data to be included in the response.
   * @return {Object} The response object with the status code and data.
   */
  static badRequest(res, data) {
    return res
      .status(RESPONSES.BAD_REQUEST)
      .json({ status: ApiResponseStatus.NOT_SUCCESS, data: data });
  }
}

module.exports = { RESPONSES, APIResponseManager };
