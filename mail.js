import transport from "./nodemailer/nodemailer.js";

function sendMail(message) {
  transport.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
      return err;
    } else {
      console.log("Email sent: " + info.response);
      return info.response;
    }
  });
}

export default { sendMail };
