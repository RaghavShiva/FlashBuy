// config/oauth2Client.js
const { google } = require('googleapis');

// console.log(process.env.GOOGLE_CLIENT_ID)
// console.log(process.env.GOOGLE_CLIENT_SECRET)


const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage' // critical for auth-code flow in React
);

module.exports = oauth2Client;
