"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const ApiError_1 = __importDefault(require("../exceptions/ApiError"));
const validateUserData = (personalInformation, password, req) => {
    const errors = (0, express_validator_1.validationResult)(req);
    const validationError = errors.array().map(error => new Error(error.msg));
    console.log(personalInformation, 'abetka dolboeb');
    if (!personalInformation || !password) {
        throw ApiError_1.default.BadRequest('Personal information and password required');
    }
    if (!errors.isEmpty()) {
        throw ApiError_1.default.BadRequest('Error on validation', validationError);
    }
};
exports.default = validateUserData;
