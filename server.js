const express = require('express');
const session = require('express-session');

const app = express();
const PORT = 3000;

// Configure the session middleware
app.use(session({
    secret: 'your_secret_key', // Use a secret key to sign the session ID cookie
    resave: false, // Prevents resaving the session if it hasn't changed
    saveUninitialized: false, // Prevents saving uninitialized sessions
    cookie: {
        maxAge: 1000 * 60 * 10, // Session will expire after 10 minutes of inactivity
    },
}));

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
