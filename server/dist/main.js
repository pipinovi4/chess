"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const https_1 = __importDefault(require("https"));
const express_config_1 = __importDefault(require("./configs/express-config"));
const socketConfig_1 = __importDefault(require("./configs/socketConfig"));
const fs_1 = __importDefault(require("fs"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const engineRoute_1 = __importDefault(require("./routes/engineRoute"));
const error_middleware_1 = __importDefault(require("./middlewares/error-middleware"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const options = {
    key: fs_1.default.readFileSync('C:/Users/Пипин/certs/client/client.key'),
    cert: fs_1.default.readFileSync('C:/Users/Пипин/certs/client/client.crt'),
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
app.use('/engine', engineRoute_1.default);
app.use(error_middleware_1.default);
const start = () => {
    (0, express_config_1.default)(app);
    (0, socketConfig_1.default)(httpsServer);
    httpsServer.listen(process.env.PORT, () => {
        console.log(`Server started port: ${process.env.PORT}`);
    });
};
start();
