class CustomError extends Error {
    constructor(message, statusCode) {
        this.statusCode = statusCode;
        super(message);
        this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
        this.operational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = { CustomError };