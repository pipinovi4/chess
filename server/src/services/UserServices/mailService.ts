import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer-smtp-transport';

const smtpPort = Number(process.env.SMTP_PORT) || 0;

class mailService {
    transporter: nodemailer.Transporter

    constructor() {
        this.transporter = nodemailer.createTransport(
            SMTPTransport({
                host: process.env.SMTP_HOST || '',
                port: smtpPort,
                secure: false,
                auth: {
                    user: process.env.SMTP_USER || '',
                    pass: process.env.SMTP_PASSWORD || '',
                },
            })            
        );
    }

    async sendActivationLink(to: string, link: string) {
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
        } catch (error) {
            console.error('Помилка відправки електронної пошти:', error);
        }
    }
}

export default new mailService();
