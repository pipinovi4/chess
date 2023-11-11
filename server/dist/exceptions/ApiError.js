"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError extends Error {
    status;
    errors;
    constructor(status, message, errors) {
        super(message);
        this.status = status;
        this.errors = errors ? errors : null;
    }
    static UnAuthorizedError() {
        return new ApiError(401, 'User not authorized');
    }
    static BadRequest(message, error) {
        return new ApiError(400, message, error);
    }
    static UnforeseenError(message, error) {
        return new ApiError(500, `Unforseen error: ${message}`, error);
    }
}
exports.default = ApiError;
