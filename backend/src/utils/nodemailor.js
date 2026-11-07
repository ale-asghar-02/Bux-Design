const config = require('../configs/config');

const sendMail = async ({ to, subject, html, text, replyTo }) => {
    const body = {
        sender: { email: config.BREVO_SENDER_EMAIL, name: 'Portfolio' },
        to: [{ email: to }],
        subject,
        htmlContent: html,
        textContent: text,
    };

    if (replyTo) body.replyTo = { email: replyTo };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'api-key': config.BREVO_API_KEY,
        },
        body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || `Brevo API error: ${response.status}`);
    }

    return data; // { messageId: '...' }
};

module.exports = sendMail;