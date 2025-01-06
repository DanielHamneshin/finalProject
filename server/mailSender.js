const nodemailer = require('nodemailer');





exports.mailSender = (to, subject, message, html) => {


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'danham531@gmail.com',
            pass: process.env.APP_PASS
        }
    });

    const mailOptions = {
        from: 'danham531@gmail.com',
        to: to,
        subject: subject,
        text: message,
        html: html
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}