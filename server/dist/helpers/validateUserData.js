"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const ApiError_1 = __importDefault(require("../exceptions/ApiError"));
const validateUserData = (email, password, req, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    const validationError = errors.array().map(error => new Error(error.msg));
    if (!email || !password) {
        throw ApiError_1.default.BadRequest('Email and password required');
    }
    if (!errors.isEmpty()) {
        throw ApiError_1.default.BadRequest('Error on validation', validationError);
    }
};
exports.default = validateUserData;
