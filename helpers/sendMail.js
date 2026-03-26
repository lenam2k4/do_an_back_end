const nodemailer = require("nodemailer");

module.exports.sendMail = (email, subject, html) => {
  // Create a test account or replace with real credentials.
  const transporter = nodemailer.createTransport({
    // host: "smtp.ethereal.email",
    // port: 587,
    // secure: false, // true for 465, false for other ports
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // // Wrap in an async IIFE so we can use await.
  // (async () => {
  //   const info = await transporter.sendMail({
  //     from: process.env.EMAIL_USER,
  //     to: email,
  //     subject: subject,
  //     // text: "Hello world?", // plain‑text body
  //     html: html, // HTML body
  //   });

  //   console.log("Message sent:", info.messageId);
  // })();

  const mailOptions = {
    from: process.env.EMAIL_USER, // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    // text: "Hello world?", // plain text body
    html: html, // html body
  };

  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      console.log(error);
    }
    else{
      console.log("Email sent: " + info.response);
    }
  })
}