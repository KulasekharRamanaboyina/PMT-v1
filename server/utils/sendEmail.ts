// import * as nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export const sendEmail = async ({
//   to,
//   subject,
//   html,
// }: {
//   to: string;
//   subject: string;
//   html: string;
// }) => {
//   await transporter.sendMail({
//     from: `"Nexus PMT" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     html,
//   });
// };


import * as nodemailer from "nodemailer";

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  // 🧪 Create test account (Ethereal)
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: `"Nexus PMT" <noreply@nexus.com>`,
    to,
    subject,
    html,
  });

  console.log("📧 Email sent (DEV)");
  console.log("🔗 Preview URL:", nodemailer.getTestMessageUrl(info));
};
