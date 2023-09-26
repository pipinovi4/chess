"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const https_1 = __importDefault(require("https"));
const express_config_1 = __importDefault(require("./configs/express-config"));
const mongoose_config_1 = __importDefault(require("./configs/mongoose-config"));
const socketConfig_1 = __importDefault(require("./configs/socketConfig"));
const fs_1 = __importDefault(require("fs"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const userRoute_2 = __importDefault(require("./routes/userRoute"));
const chatRoute_1 = __importDefault(require("./routes/chatRoute"));
const engineRoute_1 = __importDefault(require("./routes/engineRoute"));
const error_middleware_1 = __importDefault(require("./middlewares/error-middleware"));
const cors_1 = __importDefault(require("cors"));
const options = {
    key: fs_1.default.readFileSync('C:/Users/Пипин/chess/certs/client/client.key'),
    cert: fs_1.default.readFileSync('C:/Users/Пипин/chess/certs/client/client.crt'),
};
const app = (0, express_1.default)();
const httpsServer = https_1.default.createServer(options, app);
const io = new socket_io_1.Server(httpsServer, {
    cors: {
        origin: 'https://localhost:5173',
    },
});
const allowedOrigins = ['https://localhost:5173'];
app.use(express_1.default.json());
app.use('/chess', userRoute_1.default);
app.use('/authorization', userRoute_2.default);
app.use('/chat', chatRoute_1.default);
app.use('/engine', engineRoute_1.default);
app.use(express_1.default.urlencoded({ extended: true }));
app.use(error_middleware_1.default);
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
const start = () => {
    (0, express_config_1.default)(app);
    (0, mongoose_config_1.default)();
    (0, socketConfig_1.default)(io);
    httpsServer.listen(process.env.PORT, () => {
        console.log(`Server started port: ${process.env.PORT}`);
    });
};
start();
//# sourceMappingURL=main.js.map