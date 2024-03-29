const nodemailer = require('nodemailer');

const sendEmail = async options =>{

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            password: process.env.EMAIL_PASSWORD
        }
    })

    const mailOptions = {
        from:  'Henry Menez <testerd026@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }


//    await transporter.sendMail(mailOptions)
console.log(mailOptions)

}

module.exports = sendEmail;