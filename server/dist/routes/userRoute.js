"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controllers/userController"));
const router = (0, express_1.default)();
router.post('/registration', userController_1.default.registration);
router.post('/login', userController_1.default.login);
router.get('/refresh', userController_1.default.refresh);
router.post('/find-auth-data', userController_1.default.findAuthData);
router.post('/update-user-avatar', userController_1.default.updateUserAvatar);
router.post('/update-user-name', userController_1.default.updateUserName);
exports.default = router;
