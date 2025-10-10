import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, htmlContent) => {
    // create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM}>`,
        to,
        subject,
        html: htmlContent,
    });

    console.log("✅ Email sent: ", info.messageId);
    return info;
};
