// import nodemailer from 'nodemailer';

// // Create a transporter instance for sending emails
// const transporter = nodemailer.createTransport({
//   service: 'gmail',  // You can change this to your preferred email service
//   auth: {
//     user: process.env.EMAIL_USER,  // Your email address
//     pass: process.env.EMAIL_PASS,  // Your email password or application-specific password
//   },
// });

// // Email sending logic
// export const sendEmail = (mailOptions) => {
//   console.log("\n");
//   console.log("Mail Options called");

//   return new Promise((resolve, reject) => {
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error("Error sending email:", error);
//         return reject(error);
//       }
//       resolve(info);
//     });
//   });
// };


import nodemailer from 'nodemailer';

// Create a transporter instance for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Use your preferred email service
  auth: {
    user: process.env.EMAIL_USER,  // Your email address
    pass: process.env.EMAIL_PASS,  // Your email password or application-specific password
  },
  debug: true,  // Enable debugging for Nodemailer to get more detailed logs
});

// Function to send email
export const sendEmail = (mailOptions) => {
  console.log("\nMail Options called");
  console.log("Mail Options:", mailOptions);

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return reject(error);
      }
      console.log("Email sent successfully:", info);
      resolve(info);
    });
  });
};
