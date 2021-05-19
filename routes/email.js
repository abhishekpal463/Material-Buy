const nodemailer = require('nodemailer');

const sendEmail = async options => {
    const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "f2b048c17f0921",
          pass: "c5dbcc299e69cd"
        }
      });

      const mailOptions ={
          from : "abhishek",
          to : options.email,
          subject : options.subject,
          text : options.message
      }

      transporter.sendMail(mailOptions);
}

module.exports=sendEmail;

