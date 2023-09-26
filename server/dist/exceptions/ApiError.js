"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError extends Error {
    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }
    static UnAuthorizedError() {
        return new ApiError(401, 'User not authorized');
    }
    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }
    static UnforseenError() {
        return new ApiError(500, 'Unforseen error');
    }
}
exports.default = ApiError;
//# sourceMappingURL=ApiError.js.map