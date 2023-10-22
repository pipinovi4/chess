"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodemailer_smtp_transport_1 = __importDefault(require("nodemailer-smtp-transport"));
const smtpPort = Number(process.env.SMTP_PORT) || 0;
class mailService {
    transporter;
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
    async sendActivationLink(to, link) {
        try {
            await this.transporter.sendMail({
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
    }
}
exports.default = new mailService();
