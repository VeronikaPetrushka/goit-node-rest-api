import nodemailer from "nodemailer";
import "dotenv/config";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

// const message = {
//   to: ["veronikapetrushka@gmail.com"],
//   from: "49331@lazarski.pl",
//   subject: "Iphone Sale Tonight",
//   html: `<h1 style="color: red;">Click on a link and get 90% discount on a new Iphone 15 Pro</h1>`,
//   text: `Click on a link and get 90% discount on a new Iphone 15 Pro`,
// };

// transport.sendMail(message).then(console.log).catch(console.error);

export default transport;
