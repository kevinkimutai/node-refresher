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

//TODO:CUSTOMISE OUR CUSTOM EMAIL TEMPLATES
//TODO:FS MODULE/DIR
// import nodemailer from "nodemailer";
// const pug = require("pug");
// const htmlToText = require("html-to-text");

// export default class Email {
//   constructor(user, url) {
//     this.to = user.email;
//     this.firstName = user.name.split(" ")[0];
//     this.url = url;
//     this.from = `Jonas Schmedtmann <${process.env.EMAIL_FROM}>`;
//   }

//   newTransport() {
//     if (process.env.NODE_ENV === "production") {
//       // Sendgrid
//       return nodemailer.createTransport({
//         service: "Mailjet",
//         auth: {
//           user: process.env.MAILJET_USERNAME,
//           pass: process.env.MAILJET_PASSWORD,
//         },
//       });
//     }

//     return nodemailer.createTransport({
//       host: process.env.NODEMAILER_HOST,
//       port: process.env.NODEMAILER_PORT,
//       auth: {
//         user: process.env.NODEMAILER_USERNAME,
//         pass: process.env.NODEMAILER_PASSWORD,
//       },
//     });
//   }

//   // Send the actual email
//   async send(template, subject) {
//     // 1) Render HTML based on a pug template
//     const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
//       firstName: this.firstName,
//       url: this.url,
//       subject,
//     });

//     // 2) Define email options
//     const mailOptions = {
//       from: this.from,
//       to: this.to,
//       subject,
//       html,
//       text: htmlToText.fromString(html),
//     };

//     // 3) Create a transport and send email
//     await this.newTransport().sendMail(mailOptions);
//   }

//   async sendWelcome() {
//     await this.send("welcome", "Welcome to the Natours Family!");
//   }

//   async sendPasswordReset() {
//     await this.send(
//       "passwordReset",
//       "Your password reset token (valid for only 10 minutes)"
//     );
//   }
// }

// This is your test secret API key.
// const stripe = require("stripe")(
//   "sk_test_51NSNjfFuCcu0B7QiYfM6N2Go7tQuOv5Tgd893htIhhby75va2Z09ToVeWECnZnCq9cE1wlTAbSFnotd0dUw31KqN00ELGt23sx"
// );
// const express = require("express");
// const app = express();
// app.use(express.static("public"));

// const YOUR_DOMAIN = "http://localhost:4242";

// app.post("/create-checkout-session", async (req, res) => {
//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
//         price: "{{PRICE_ID}}",
//         quantity: 1,
//       },
//     ],
//     mode: "payment",
//     success_url: `${YOUR_DOMAIN}?success=true`,
//     cancel_url: `${YOUR_DOMAIN}?canceled=true`,
//   });

//   res.redirect(303, session.url);
// });

// app.listen(4242, () => console.log("Running on port 4242"));
