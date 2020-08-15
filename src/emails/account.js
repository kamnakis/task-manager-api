const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    // sgMail.send({
    //     to: email,
    //     from: 'kamnis1997@gmail.com',
    //     subject: 'Welcome to Task Manager',
    //     text: `Dear ${name}. Welcome to Task Manager. Let me know how you get along with the app!`
    // })
}

const sendCancellationEmail = (email, name) => {
    // sgMail.send({
    //     to: email,
    //     from: 'kamnis1997@gmail.com',
    //     subject: 'Sad to see you go',
    //     text: `Dear ${name}. Hope to see you back soon!`
    // })
}

module.exports = { sendWelcomeEmail, sendCancellationEmail }