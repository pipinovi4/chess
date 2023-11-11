"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const https_1 = __importDefault(require("https"));
const express_config_1 = __importDefault(require("./configs/express-config"));
const socketConfig_1 = __importDefault(require("./configs/socketConfig"));
const fs = __importStar(require("fs"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const error_middleware_1 = __importDefault(require("./middlewares/error-middleware"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_config_1 = __importDefault(require("./configs/mongoose-config"));
const dataRoutes_1 = __importDefault(require("./routes/dataRoutes"));
const options = {
    key: fs.readFileSync('C:/Users/Пипин/certs/client/client.key'),
    cert: fs.readFileSync('C:/Users/Пипин/certs/client/client.crt'),
};
const app = (0, express_1.default)();
const httpsServer = https_1.default.createServer(options, app);
const allowedOrigins = ['https://localhost:5173'];
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use('/authorization', userRoute_1.default);
app.use('/data', dataRoutes_1.default);
app.use(error_middleware_1.default);
const start = () => {
    (0, express_config_1.default)(app);
    (0, socketConfig_1.default)(httpsServer);
    (0, mongoose_config_1.default)();
    httpsServer.listen(process.env.PORT, () => {
        console.log(`Server started port: ${process.env.PORT}`);
    });
};
start();
