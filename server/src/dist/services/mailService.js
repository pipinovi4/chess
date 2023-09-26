"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodemailer_smtp_transport_1 = __importDefault(require("nodemailer-smtp-transport"));
const smtpPort = Number(process.env.SMTP_PORT) || 0;
class mailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport((0, nodemailer_smtp_transport_1.default)({
            host: process.env.SMTP_HOST || '',
            port: smtpPort,
            secure: false,
            auth: {
                user: process.env.SMTP_USER || '',
                pass: process.env.SMTP_PASSWORD || '',
            },
        }));
    }
    sendActivationLink(to, link) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.transporter.sendMail({
                    from: process.env.SMTP_USER,
                    to,
                    subject: 'Активація аккаунта на ' + process.env.API_URL,
                    text: '',
                    html: `
                    <div>
                        <h1>Для активації перейдіть за посиланням</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `,
                });
            }
            catch (error) {
                console.error('Помилка відправки електронної пошти:', error);
            }
        });
    }
}
exports.default = new mailService();
//# sourceMappingURL=mailService.js.map