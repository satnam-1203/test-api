const express = require('express');
const session = require('express-session');
const cors = require('cors'); // Import the cors package

const app = express();
const PORT = 3000;

// Configure CORS middleware
/app.use(cors({
    origin: ["https://grcportal.netlify.app"],
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
        expires: 1000 * 60 * 60 * 24, // One day expiration
        secure: true, // Only send cookies over HTTPS (Render uses HTTPS)
        httpOnly: true, // Protect against client-side access to the cookie
        sameSite: 'None',
        path : "/",
    },
})
);

// Route to set a session variable and create a cookie
app.get('/create-cookie', (req, res) => {
    req.session.user = {
        id: 1,
        name: 'Alice',
    };
    res.send('Cookie created and session variable set!');
});

// Route to get the session variable from the cookie
app.get('/get-cookie', (req, res) => {
    if (req.session.user) {
        res.send(`User: ${req.session.user.name}`);
    } else {
        res.send('No session data found.');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
