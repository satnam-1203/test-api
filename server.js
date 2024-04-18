const express = require('express');
const session = require('express-session');
const cors = require('cors');

// Create an Express app
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
        'Cookie',
    ],
    exposedHeaders: ["Set-Cookie"],
    credentials: true,
    optionsSuccessStatus: 200,
}));

// Configure session middleware
app.use(session({
    key: 'userId',
    secret: 'your-secret-key', // Use a secure secret key
    resave: false,
    secure : true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // One day expiration
        httpOnly: true, // Prevent client-side access to the cookie
        sameSite: 'None', // Allow cross-origin requests
        path: '/',
    },
}));

// Route to automatically create a user and set a cookie
app.get('/create-cookie', (req, res) => {
    // Automatically create a user (hardcoded example user)
    const user = {
        id: 1, // Example user ID
        name: 'Alice', // Example user name
    };

    // Set session data for the created user
    req.session.userId = user.id;
    req.session.userName = user.name;

    // Set a cookie in the client's browser
    res.cookie('userCookie', 'userValue', {
        maxAge: 1000 * 60 * 60 * 24, // One day expiration
        httpOnly: true, // Prevent client-side access to the cookie
        secure : true,
        sameSite: 'None', // Allow cross-origin requests
        path: '/',
    });

    // Log session data for troubleshooting
    console.log("Session data set:", req.session);

    // Send a success response to the client
    res.status(200).json({ message: 'User created and session data set!', userId: user.id, userName: user.name });
});

// Route to get the session variable and display it
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
