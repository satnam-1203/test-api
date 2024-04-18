const express = require('express');
const session = require('express-session');
const cors = require('cors'); // Import the cors package

const app = express();
const PORT = 3000;

// Configure CORS middleware
app.use(cors({
    origin: ["https://cookie-testing.netlify.app"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Accept',
        'X-Requested-With',
        'X-API-Key',
        'X-HTTP-Method-Override',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Methods',
        'Access-Control-Allow-Credentials',
        'Cookie',
    ],
    exposedHeaders: ["Set-Cookie"],
    credentials: true,
    optionsSuccessStatus: 200, // Ensure successful response for OPTIONS preflight
}));

// Configure the session middleware
app.use(session({
    key: "userId",
    secret: "komedi",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // One day expiration
        secure: true, // Only send cookies over HTTPS (Render uses HTTPS)
        httpOnly: true, // Protect against client-side access to the cookie
        sameSite: 'None',
        path: "/",
    },
}));

// Route to set a session variable and create a cookie
app.get('/create-cookie', (req, res) => {
    req.session.userId = 1; // Example user ID
    req.session.userName = 'Alice'; // Example user name

    res.cookie('userCookie', 'userValue', {
        maxAge: 1000 * 60 * 60 * 24, // One day expiration
        secure: true, // Only send cookies over HTTPS
        httpOnly: true, // Prevent client-side access to the cookie
        sameSite: 'None', // Allow cross-origin requests
        path: '/', // Cookie is valid for the entire site
    });

    // Log session data for troubleshooting
    console.log("Session data set:", req.session);
    res.send('Cookie created and session data set!');
});

app.get('/get-cookie', (req, res) => {
    // Log session data for troubleshooting
    console.log("Retrieved session data:", req.session);
    
    if (req.session.userId && req.session.userName) {
        res.send(`User ID: ${req.session.userId}, User Name: ${req.session.userName}`);
    } else {
        res.send('No session data found.');
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
