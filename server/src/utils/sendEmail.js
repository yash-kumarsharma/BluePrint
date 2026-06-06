const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Check if SMTP credentials are configured. If not, fallback to console logging for easy development testing.
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_EMAIL ||
    !process.env.SMTP_PASSWORD
  ) {
    console.log('\n┌────────────────────────────────────────────────────────┐');
    console.log('│  ⚠️  [DEV MODE] SMTP NOT CONFIGURED                     │');
    console.log('│  Email logged below to facilitate local testing:       │');
    console.log('├────────────────────────────────────────────────────────┤');
    console.log(`│ TO      : ${options.email}`);
    console.log(`│ SUBJECT : ${options.subject}`);
    console.log(`│ BODY    : ${options.message || 'HTML payload sent'}`);
    if (options.html) {
      console.log('├────────────────────────────────────────────────────────┤');
      console.log('│ HTML CONTENT:');
      console.log(options.html);
    }
    console.log('└────────────────────────────────────────────────────────┘\n');
    return { success: true, mode: 'console' };
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: parseInt(process.env.SMTP_PORT, 10) === 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Mail message setup
  const message = {
    from: `"${process.env.SMTP_FROM_NAME || 'BluePrint'}" <${process.env.SMTP_FROM_EMAIL || 'no-reply@blueprint.ai'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(message);
  console.log(`[SMTP] Email dispatched. Message ID: ${info.messageId}`);
  return { success: true, mode: 'smtp', messageId: info.messageId };
};

module.exports = sendEmail;
