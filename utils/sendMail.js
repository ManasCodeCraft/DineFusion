const nodemailer = require('nodemailer');
const {
    mailHost,
    mailId,
    mailPassword,
    mailPort,
    baseURL,
  } = require("../config/config");

// function to send verify link to the user's email
module.exports.sendVerifyEmailLink = async function(user){
    try{
    const email = user.email;
    const verifylink = formatVerifyLink(user._id ,user.verifyEmailToken);
  
    const mailOptions = {
      to: email,
      subject: "Verify Your Email",
      html: `
              <h1>Verify Your Email</h1>
              <a href="${verifylink}">Click here to verify your email</a>
            `,
     };
  
     await sendMail(mailOptions)
    }
    catch(error){
      console.error(error);
    }
  };

// function to send mail via nodemailer
async function sendMail(mailOptions) {
    try {
  
      // creating transport object 
      const transporter = nodemailer.createTransport({
        host: mailHost,
        port: mailPort,
        secure: true,
        auth: {
          user: mailId,
          pass: mailPassword,
        },
      });
      
      // checking if mail options already contain the from property or not
      if(!mailOptions.hasOwnProperty('from') || !mailOptions.from){
         mailOptions.from = mailId;
      }
  
      // sending mail
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error(error);
        } else {
          console.log("Email sent:" + info.response);
        }
      });
  
    } catch (error) {
      console.error("An error occurred in sending mail");
      console.error(error);
    }
}


const formatVerifyLink = function (userid, token) {
    return `${baseURL}/auth/verify-email/${userid}/${token}`;
};