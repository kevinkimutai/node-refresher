import nodemailer from "nodemailer";

const sendEmail = async (msgOptions) => {
  const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    //secure: true,
    auth: {
      user: process.env.NODEMAILER_USERNAME,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Giftr <gifr@messaging.com>",

    to: msgOptions.email,
    subject: msgOptions.subject,
    text: msgOptions.message,
    // html:
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
