import nodemailer from 'nodemailer';

export async function POST(req) {
    try {
        const body = await req.json();
        const { to, subject, html } = body;

        if (!to || !subject || !html) {
            return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400 });
        }

        // Configure the Office 365 SMTP transporter
        const transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false, // use TLS
            auth: {
                user: process.env.OFFICE365_USER, // Office 365 email address
                pass: process.env.OFFICE365_PASS, // Office 365 email password or app password
            },
        });

        // Send the email
        await transporter.sendMail({
            from: `"Your Name" <${process.env.OFFICE365_USER}>`, // Sender address
            to, // Receiver's email address
            subject, // Subject line
            html, // Plain text body
        });

        return new Response(JSON.stringify({ message: 'Email sent successfully' }), { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return new Response(JSON.stringify({ message: 'Error sending email', error: error.message }), {
            status: 500,
        });
    }
}
