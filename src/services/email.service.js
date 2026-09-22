import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

export const sendTicketConfirmationEmail = async ({
    to,
    eventTitle,
    eventDate,
    eventLocation,
    quantity,
    reservationCode
}) => {
    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject: `Confirmación de inscripción: ${eventTitle}`,
        html: `
            <h2>Inscripción confirmada</h2>

            <p>Tu inscripción al evento fue confirmada correctamente.</p>

            <p><strong>Evento:</strong> ${eventTitle}</p>
            <p><strong>Fecha:</strong> ${eventDate}</p>
            <p><strong>Ubicación:</strong> ${eventLocation}</p>
            <p><strong>Cantidad:</strong> ${quantity}</p>
            <p><strong>Código de reserva:</strong> ${reservationCode}</p>

            <p>¡Gracias por inscribirte!</p>
        `
    });
};

export const verifyEmailConnection = async () => {
    await transporter.verify();
    console.log("✅ Conexión SMTP con Gmail verificada");
};