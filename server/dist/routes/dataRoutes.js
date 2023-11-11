"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GetDataService_1 = __importDefault(require("../services/GetDataService"));
const router = (0, express_1.Router)();
router.post('/get-user', GetDataService_1.default.getUserById);
exports.default = router;
