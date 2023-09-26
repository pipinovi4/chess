"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const engineController_1 = __importDefault(require("../controllers/engineController"));
const router = (0, express_1.default)();
router.get('start-engine', engineController_1.default.startEngine);
router.get('stop-engine', engineController_1.default.stopEngine);
exports.default = router;
//# sourceMappingURL=engineRoute.js.map