const axios = require('axios');

const sendConfirmationEmail = async ({ to, subject, html }) => {
  const apiKey = process.env.MAILERSEND_API_KEY;
  
  const data = {
    from: {
      email: process.env.EMAIL_USER,  // The verified sender email address
      name: 'World Oasis',
    },
    to: [
      {
        email: to,
      },
    ],
    subject: subject,
    html: html,
  };

  try {
    const response = await axios.post('https://api.mailersend.com/v1/email', data, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 202) {
      console.log('Email sent successfully');
    } else {
      console.error('Failed to send email', response.data);
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendConfirmationEmail;
